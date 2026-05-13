/**
 * Checks if an error is transient (e.g. rate limit, server error)
 * and should trigger a fallback.
 */
export function isTransientProviderError(err: any): boolean {
  if (!err) return false;
  
  const message = (err.message || "").toLowerCase();
  const status = err.status || err.statusCode || 0;

  // Rate limits
  if (status === 429 || message.includes("rate limit") || message.includes("too many requests")) {
    return true;
  }

  // Server errors
  if (status >= 500 || message.includes("server error") || message.includes("overloaded")) {
    return true;
  }

  // Timeouts (handled explicitly too, but good as fallback)
  if (message.includes("timeout") || message.includes("deadline")) {
    return true;
  }

  return false;
}
