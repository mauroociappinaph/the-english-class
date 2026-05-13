import { isTransientProviderError } from "./utils/errors";

export interface FallbackOptions {
  timeoutMs?: number;
}

/**
 * Proxy-based decorator to provide transparent fallback for services.
 */
export function withFallback<T extends object>(
  target: T,
  fallback: T,
  options: FallbackOptions = {}
): T {
  const { timeoutMs = 10000 } = options;

  return new Proxy(target, {
    get(target: T, prop: string | symbol, receiver: any) {
      const originalValue = Reflect.get(target, prop, receiver);
      console.log(`[Resilience Proxy] Accessing: ${String(prop)} on ${target.constructor.name}`);

      if (typeof originalValue !== "function") {
        return originalValue;
      }

      // Handle Streaming methods (AsyncGenerators)
      if (prop === "analyzeStream") {
        return function (...args: any[]) {
          return (async function* () {
            const start = performance.now();
            let generator: AsyncGenerator<any, any, any>;
            
            try {
              const primaryStream = async () => {
                // Call the original generator function
                return (originalValue as (...a: unknown[]) => AsyncGenerator<any, any, any>).apply(target, args);
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
                } else {
                  // If first result is done but not yielded anything, just finish
                  const end = performance.now();
                  console.log(`[Resilient Stream] Primary provider (${target.constructor.name}) FINISHED EMPTY in ${((end - start) / 1000).toFixed(2)}s`);
                  return;
                }
              }

              for await (const chunk of generator) {
                innerChunkCount++;
                yield chunk;
              }
              const end = performance.now();
              console.log(`[Resilient Stream] Primary provider (${target.constructor.name}) COMPLETED in ${((end - start) / 1000).toFixed(2)}s with ${innerChunkCount} chunks`);
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
                  const fallbackGenerator = (fallbackFn as (...a: unknown[]) => AsyncGenerator<any, any, any>).apply(fallback, args);
                  
                  yield* fallbackGenerator;
                  const endFallback = performance.now();
                  console.log(`[Resilient Stream] Fallback provider (${fallback.constructor.name}) COMPLETED in ${((endFallback - startFallback) / 1000).toFixed(2)}s`);
                  return;
                }
              }
              throw err;
            }
          })();
        };
      }

      // Handle standard methods (Promises)
      return async function (...args: any[]) {
        const start = performance.now();
        try {
          const primaryCall = async () => await originalValue.apply(target, args);
          
          if (timeoutMs) {
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error(`TIMEOUT: Primary provider took > ${timeoutMs}ms`)), timeoutMs)
            );
            const result = await Promise.race([primaryCall(), timeoutPromise]);
            const end = performance.now();
            console.log(`[Resilient] Primary provider (${target.constructor.name}) SUCCESS in ${((end - start) / 1000).toFixed(2)}s`);
            return result;
          }
          
          return await primaryCall();
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
              const result = await (fallbackFn as (...a: unknown[]) => Promise<unknown>).apply(fallback, args);
              const endFallback = performance.now();
              console.log(`[Resilient] Fallback provider (${fallback.constructor.name}) SUCCESS in ${((endFallback - startFallback) / 1000).toFixed(2)}s`);
              return result;
            }
          }
          throw err;
        }
      };
    },
  });
}
