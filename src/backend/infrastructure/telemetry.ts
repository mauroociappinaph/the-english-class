import { prisma } from "./db";

/**
 * Higher-Order Function to measure Server Action performance
 */
export async function withTelemetry<T>(
  actionName: string,
  fn: () => Promise<T>,
  metadata?: unknown
): Promise<T> {
  const start = performance.now();
  let success = true;
  let errorMsg: string | null = null;

  try {
    const result = await fn();
    
    // Heuristic to detect handled errors in common response patterns
    if (result && typeof result === 'object' && result !== null && 'success' in result) {
      const res = result as Record<string, unknown>;
      if (res.success === false) {
        success = false;
        if (res.error && typeof res.error === 'object') {
          const err = res.error as Record<string, unknown>;
          if ('message' in err) {
            errorMsg = String(err.message);
          }
        }
      }
    }

    return result;
  } catch (error: unknown) {
    success = false;
    errorMsg = error instanceof Error ? error.message : String(error);
    throw error;

  } finally {
    const end = performance.now();
    const duration = Math.round(end - start);

    // Persist metrics asynchronously
    prisma.actionMetric.create({
      data: {
        actionName,
        duration,
        success,
        error: errorMsg,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    }).catch((telemetryError: unknown) => {
      console.error("[Telemetry Error]:", telemetryError);
    });


    console.log(`[Telemetry] ${actionName}: ${duration}ms (Success: ${success}${errorMsg ? ` - Error: ${errorMsg}` : ''})`);
  }
}
