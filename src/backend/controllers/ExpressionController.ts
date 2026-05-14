import { withTelemetry } from "@/backend/infrastructure/telemetry";
import { expressionService } from "@/backend/infrastructure/registry";
import { StudyPerformance } from "@/shared/types/expression";

/**
 * Controller to orchestrate Expression actions
 */
export class ExpressionController {
  static async getOne(text: string) {
    return withTelemetry("getExpression", () => expressionService.getExpression(text), { text });
  }

  static async getById(id: string) {
    return withTelemetry("getExpressionById", () => expressionService.getExpressionById(id), { id });
  }

  static async analyze(text: string) {
    console.log(`[Controller] Starting analysis for: "${text}"`);
    return withTelemetry("analyzeExpression", async () => {
      try {
        return await expressionService.analyzeExpression(text);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[Controller] CRITICAL: Analysis pipeline failed for "${text}":`, errorMessage);
        if (error instanceof Error && error.stack) {
          console.error(error.stack);
        }
        return null;
      }
    }, { text });
  }

  static async getAll() {
    return withTelemetry("getExpressions", () => expressionService.getExpressions());
  }

  static async getReviewSession(limit: number = 12) {
    return withTelemetry("getReviewSession", () => expressionService.getReviewSession(limit), { limit });
  }

  static async submitReview(id: string, performance: StudyPerformance) {
    return withTelemetry("submitReview", () => expressionService.submitReview(id, performance), { id, performance });
  }

  static async delete(id: string) {
    return withTelemetry("deleteExpression", () => expressionService.deleteExpression(id), { id });
  }

  static async getAdaptivePath(failedIds: string[]) {
    return withTelemetry("getAdaptivePath", () => expressionService.getAdaptivePath(failedIds), { failedIds });
  }
}
