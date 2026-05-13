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
 * falls back to `fallback` on transient provider errors (429 / 5xx).
 * Handles both normal async methods (Promises) and streaming methods (AsyncGenerators).
 *
 * Usage:
 *   const analyzer = withFallback(groqLinguistic, geminiLinguistic);
 *   const slangAnalyzer = withFallback(groqSlang, geminiSlang);
 */
export function withFallback<T extends object>(primary: T, fallback: T): T {
  return new Proxy(primary, {
    get(target, prop) {
      const fn = target[prop as keyof T];
      if (typeof fn !== "function") return fn;

      // Check if it's an AsyncGeneratorFunction
      if (fn.constructor.name === "AsyncGeneratorFunction" || prop.toString().includes("Stream")) {
        return async function* (...args: unknown[]) {
          let generator: AsyncGenerator<unknown, unknown, unknown>;
          try {
            generator = await (fn as (...a: unknown[]) => AsyncGenerator<unknown, unknown, unknown>).apply(target, args);
            // Try to get the first chunk to catch initialization errors (e.g. 429)
            const firstResult = await generator.next();
            if (!firstResult.done) {
              yield firstResult.value;
            } else {
              return firstResult.value;
            }
          } catch (err: unknown) {
            if (isTransientProviderError(err)) {
              console.warn(
                `[Resilient Stream] Primary provider failed (${(err as Error).message?.slice(0, 80)}). Switching to fallback.`
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
        try {
          return await (fn as (...a: unknown[]) => unknown).apply(target, args);
        } catch (err: unknown) {
          if (isTransientProviderError(err)) {
            console.warn(
              `[Resilient] Primary provider failed (${(err as Error).message?.slice(0, 80)}). Switching to fallback.`
            );
            const fallbackFn = fallback[prop as keyof T];
            if (typeof fallbackFn === "function") {
              return await (fallbackFn as (...a: unknown[]) => unknown).apply(fallback, args);
            }
          }
          throw err;
        }
      };
    },
  });
}
