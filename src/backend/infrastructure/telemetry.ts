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
    return result;
  } catch (error: unknown) {
    success = false;
    errorMsg = error instanceof Error ? error.message : String(error);
    throw error;

  } finally {
    const end = performance.now();
    const duration = Math.round(end - start);

    // Persist metrics asynchronously
    // We don't await this to keep the main action fast, 
    // but we catch errors to avoid crashing.
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


    console.log(`[Telemetry] ${actionName}: ${duration}ms (Success: ${success})`);
  }
}
