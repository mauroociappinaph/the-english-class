/**
 * Detects Groq rate-limit (429) and server errors (503/502) that warrant
 * falling back to an alternative provider.
 */
export function isTransientProviderError(err: unknown): boolean {
  if (!err) return false;

  // Extract message and status
  const msg = (err as Error).message ?? "";
  const errObj = err as Record<string, unknown>;
  const status = errObj.status || errObj.statusCode;

  // Groq/OpenAI SDKs often prefix with "RateLimitError: 429" or similar
  const hasTransientCode = /\b(429|503|502|504|401)\b/.test(msg) || 
                           [429, 503, 502, 504, 401].includes(Number(status));

  return hasTransientCode;
}

/**
 * Creates a resilient analyzer that runs `primary` and transparently
 * falls back to `fallback` on transient provider errors (429 / 5xx)
 * OR if the primary provider takes longer than `timeoutMs`.
 */
export function withFallback<T extends object>(
  primary: T, 
  fallback: T, 
  options: { timeoutMs?: number } = {}
): T {
  const { timeoutMs } = options;

  return new Proxy(primary, {
    get(target, prop) {
      const fn = target[prop as keyof T];
      if (typeof fn !== "function") return fn;

      // Check if it's an AsyncGeneratorFunction
      if (fn.constructor.name === "AsyncGeneratorFunction" || prop.toString().includes("Stream")) {
        return async function* (...args: unknown[]) {
          const start = performance.now();
          let generator: AsyncGenerator<unknown, unknown, unknown>;
          
          const primaryStream = async () => {
            return await (fn as (...a: unknown[]) => AsyncGenerator<unknown, unknown, unknown>).apply(target, args);
          };

          try {
            // If timeout is set, we wait for the generator initialization
            if (timeoutMs) {
              const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error(`TIMEOUT: Primary stream took > ${timeoutMs}ms to initialize`)), timeoutMs)
              );
              generator = await Promise.race([primaryStream(), timeoutPromise]);
            } else {
              generator = await primaryStream();
            }

            // Try to get the first chunk to catch initialization errors (e.g. 429)
            const firstResult = await generator.next();
            const end = performance.now();
            console.log(`[Resilient Stream] Primary provider (${target.constructor.name}) INITIALIZED in ${((end - start) / 1000).toFixed(2)}s`);
            
            if (!firstResult.done) {
              yield firstResult.value;
            } else {
              return firstResult.value;
            }
          } catch (err: unknown) {
            const endPrimary = performance.now();
            const isTimeout = (err as Error).message?.includes("TIMEOUT");
            const errMsg = (err as Error).message || "Unknown error";
            if (isTransientProviderError(err) || isTimeout) {
              console.warn(
                `[Resilient Stream] Primary provider (${target.constructor.name}) ${isTimeout ? 'TIMED OUT' : 'FAILED'} in ${((endPrimary - start) / 1000).toFixed(2)}s (${errMsg}). Switching to fallback.`
              );
              const fallbackFn = fallback[prop as keyof T];
              if (typeof fallbackFn === "function") {
                const startFallback = performance.now();
                const fallbackGenerator = await (fallbackFn as (...a: unknown[]) => AsyncGenerator<unknown, unknown, unknown>).apply(fallback, args);
                const endFallback = performance.now();
                console.log(`[Resilient Stream] Fallback provider (${fallback.constructor.name}) INITIALIZED in ${((endFallback - startFallback) / 1000).toFixed(2)}s`);
                yield* fallbackGenerator;
                return;
              }
            }
            throw err;
          }

          // If we succeeded the first chunk, just yield the rest
          yield* generator;
        };
      }

      // Normal Promise-based function
      return async (...args: unknown[]) => {
        const start = performance.now();
        const primaryPromise = (fn as (...a: unknown[]) => unknown).apply(target, args);

        const runWithFallback = async () => {
          try {
            let result;
            if (timeoutMs) {
              const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error(`TIMEOUT: Primary provider took > ${timeoutMs}ms`)), timeoutMs)
              );
              result = await Promise.race([primaryPromise, timeoutPromise]);
            } else {
              result = await primaryPromise;
            }
            const end = performance.now();
            console.log(`[Resilient] Primary provider (${target.constructor.name}) SUCCEEDED in ${((end - start) / 1000).toFixed(2)}s`);
            return result;
          } catch (err: unknown) {
            const endPrimary = performance.now();
            const isTimeout = (err as Error).message?.includes("TIMEOUT");
            const errMsg = (err as Error).message || "Unknown error";
            if (isTransientProviderError(err) || isTimeout) {
              console.warn(
                `[Resilient] Primary provider (${target.constructor.name}) ${isTimeout ? 'TIMED OUT' : 'FAILED'} in ${((endPrimary - start) / 1000).toFixed(2)}s (${errMsg}). Switching to fallback.`
              );
              const fallbackFn = fallback[prop as keyof T];
              if (typeof fallbackFn === "function") {
                const startFallback = performance.now();
                const fallbackResult = await (fallbackFn as (...a: unknown[]) => unknown).apply(fallback, args);
                const endFallback = performance.now();
                console.log(`[Resilient] Fallback provider (${fallback.constructor.name}) COMPLETED in ${((endFallback - startFallback) / 1000).toFixed(2)}s`);
                return fallbackResult;
              }
            }
            throw err;
          }
        };

        return runWithFallback();
      };
    },
  });
}
