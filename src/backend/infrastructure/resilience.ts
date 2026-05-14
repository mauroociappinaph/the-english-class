import { isTransientProviderError } from "./utils/errors";
import { FallbackOptions } from "./types";

/**
 * Proxy-based decorator to provide transparent fallback for services.
 * Automatically handles timeouts and transient errors for both standard Promises
 * and AsyncGenerators (streaming).
 */
export function withFallback<T extends object>(
  target: T,
  fallback: T,
  options: FallbackOptions = {}
): T {
  const { timeoutMs = 10000 } = options;

  return new Proxy(target, {
    get(targetObj: T, prop: string | symbol, receiver: unknown) {
      const originalValue = Reflect.get(targetObj, prop, receiver);

      if (typeof originalValue !== "function") {
        return originalValue;
      }

      const methodName = String(prop);
      console.log(`[Resilience Proxy] Intercepting: ${methodName} on ${targetObj.constructor.name}`);

      // 1. Handle Streaming methods (AsyncGenerators)
      if (prop === "analyzeStream") {
        return function (this: unknown, ...args: unknown[]) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const self = this;
          return (async function* () {
            const start = performance.now();
            let generator: AsyncGenerator<unknown, unknown, unknown>;

            try {
              const primaryStream = async () => {
                const fn = originalValue as (...a: unknown[]) => AsyncGenerator<unknown, unknown, unknown>;
                return fn.apply(targetObj, args);
              };

              if (timeoutMs) {
                const timeoutPromise = new Promise<never>((_, reject) =>
                  setTimeout(() => reject(new Error(`TIMEOUT: Primary provider took > ${timeoutMs}ms to initialize stream`)), timeoutMs)
                );
                generator = await Promise.race([primaryStream(), timeoutPromise]);
              } else {
                generator = await primaryStream();
              }

              let innerChunkCount = 0;
              const nextWithTimeout = async () => await generator.next();

              if (timeoutMs) {
                console.log(`[Resilient Stream] Waiting up to ${timeoutMs}ms for FIRST chunk...`);
                const chunkTimeoutPromise = new Promise<never>((_, reject) =>
                  setTimeout(() => reject(new Error(`TIMEOUT: Primary stream took > ${timeoutMs}ms to produce first chunk`)), timeoutMs)
                );

                const firstResult = await Promise.race([nextWithTimeout(), chunkTimeoutPromise]);
                console.log(`[Resilient Stream] FIRST chunk arrived (done: ${firstResult.done})`);

                if (!firstResult.done) {
                  innerChunkCount++;
                  yield firstResult.value;
                } else if (innerChunkCount === 0) {
                  // If it's already done and we have 0 chunks, it might be an issue depending on usage
                  // but we let it complete normally if it's a valid empty stream.
                }
              }

              for await (const chunk of generator) {
                innerChunkCount++;
                yield chunk;
              }
              const end = performance.now();
              console.log(`[Resilient Stream] Primary provider COMPLETED in ${((end - start) / 1000).toFixed(2)}s with ${innerChunkCount} chunks`);
            } catch (err: unknown) {
              const endPrimary = performance.now();
              const isTimeout = (err as Error).message?.includes("TIMEOUT");
              const errMsg = (err as Error).message || "Unknown error";

              if (isTransientProviderError(err) || isTimeout) {
                console.warn(
                  `[Resilient Stream] Primary provider ${isTimeout ? 'TIMED OUT' : 'FAILED'} in ${((endPrimary - start) / 1000).toFixed(2)}s (${errMsg}). Switching to fallback.`
                );

                const fallbackFn = (fallback as Record<string | symbol, unknown>)[prop];
                if (typeof fallbackFn === "function") {
                  const startFallback = performance.now();
                  const fn = fallbackFn as (...a: unknown[]) => AsyncGenerator<unknown, unknown, unknown>;
                  const fallbackGenerator = fn.apply(fallback, args);

                  yield* fallbackGenerator;
                  const endFallback = performance.now();
                  console.log(`[Resilient Stream] Fallback provider COMPLETED in ${((endFallback - startFallback) / 1000).toFixed(2)}s`);
                  return;
                }
              }
              throw err;
            }
          })();
        };
      }

      // 2. Handle standard methods (Promises)
      return async function (this: unknown, ...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const start = performance.now();
        try {
          const primaryCall = async () => await originalValue.apply(targetObj, args);

          if (timeoutMs) {
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`TIMEOUT: Primary provider took > ${timeoutMs}ms`)), timeoutMs)
            );
            const result = (await Promise.race([primaryCall(), timeoutPromise])) as unknown;
            const end = performance.now();
            console.log(`[Resilient] Primary provider SUCCESS in ${((end - start) / 1000).toFixed(2)}s`);
            return result;
          }

          return (await primaryCall()) as unknown;
        } catch (err: unknown) {
          const endPrimary = performance.now();
          const isTimeout = (err as Error).message?.includes("TIMEOUT");
          const errMsg = (err as Error).message || "Unknown error";

          if (isTransientProviderError(err) || isTimeout) {
            console.warn(
              `[Resilient] Primary provider ${isTimeout ? 'TIMED OUT' : 'FAILED'} in ${((endPrimary - start) / 1000).toFixed(2)}s (${errMsg}). Switching to fallback.`
            );

            const fallbackFn = (fallback as Record<string | symbol, unknown>)[prop];
            if (typeof fallbackFn === "function") {
              const startFallback = performance.now();
              const fn = fallbackFn as (...a: unknown[]) => Promise<unknown>;
              const result = await fn.apply(fallback, args);
              const endFallback = performance.now();
              console.log(`[Resilient] Fallback provider SUCCESS in ${((endFallback - startFallback) / 1000).toFixed(2)}s`);
              return result;
            }
          }
          throw err;
        }
      };
    },
  });
}
