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
            if (!firstResult.done) {
              yield firstResult.value;
            } else {
              return firstResult.value;
            }
          } catch (err: unknown) {
            const isTimeout = (err as Error).message?.includes("TIMEOUT");
            const errMsg = (err as Error).message || "Unknown error";
            if (isTransientProviderError(err) || isTimeout) {
              console.warn(
                `[Resilient Stream] Primary provider ${isTimeout ? 'timed out' : 'failed'} (${errMsg}). Switching to fallback.`
              );
              const fallbackFn = fallback[prop as keyof T];
              if (typeof fallbackFn === "function") {
                const fallbackGenerator = await (fallbackFn as (...a: unknown[]) => AsyncGenerator<unknown, unknown, unknown>).apply(fallback, args);
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
        const primaryPromise = (fn as (...a: unknown[]) => unknown).apply(target, args);

        const runWithFallback = async () => {
          try {
            if (timeoutMs) {
              const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error(`TIMEOUT: Primary provider took > ${timeoutMs}ms`)), timeoutMs)
              );
              return await Promise.race([primaryPromise, timeoutPromise]);
            }
            return await primaryPromise;
          } catch (err: unknown) {
            const isTimeout = (err as Error).message?.includes("TIMEOUT");
            const errMsg = (err as Error).message || "Unknown error";
            if (isTransientProviderError(err) || isTimeout) {
              console.warn(
                `[Resilient] Primary provider ${isTimeout ? 'timed out' : 'failed'} (${errMsg}). Switching to fallback.`
              );
              const fallbackFn = fallback[prop as keyof T];
              if (typeof fallbackFn === "function") {
                return await (fallbackFn as (...a: unknown[]) => unknown).apply(fallback, args);
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
