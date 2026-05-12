/**
 * Detects Groq rate-limit (429) and server errors (503/502) that warrant
 * falling back to an alternative provider.
 */
export function isTransientProviderError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;

  const msg = err.message ?? "";
  // Groq SDK surfaces the HTTP status at the start of the message: "429 {...}"
  if (/^(429|503|502)\b/.test(msg)) return true;

  // SDK may also expose a .status property
  const status = (err as unknown as Record<string, unknown>).status;
  return status === 429 || status === 503 || status === 502;
}

/**
 * Creates a resilient analyzer that runs `primary` and transparently
 * falls back to `fallback` on transient provider errors (429 / 5xx).
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
