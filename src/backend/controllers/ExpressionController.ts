import { withTelemetry } from "@/backend/infrastructure/telemetry";
import { expressionService } from "@/backend/infrastructure/registry";

/**
 * Controller to orchestrate Expression actions
 */
export class ExpressionController {
  static async getOne(text: string) {
    return withTelemetry("getExpression", () => expressionService.getExpression(text), { text });
  }

  static async analyze(text: string) {
    return withTelemetry("analyzeExpression", async () => {
      try {
        return await expressionService.analyzeExpression(text);
      } catch (error) {
        console.error(`[Controller] Analysis failed for "${text}":`, error);
        return null;
      }
    }, { text });
  }

  static async getAll() {
    return withTelemetry("getExpressions", () => expressionService.getExpressions());
  }

  static async delete(id: string) {
    return withTelemetry("deleteExpression", () => expressionService.deleteExpression(id), { id });
  }
}
