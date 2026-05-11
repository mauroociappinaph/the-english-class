import { withTelemetry } from "@/backend/infrastructure/telemetry";
import { ExpressionService } from "@/backend/services/ExpressionService";

/**
 * Controller to orchestrate Expression actions
 */
export class ExpressionController {
  static async getOne(text: string) {
    return withTelemetry("getExpression", () => ExpressionService.getExpression(text), { text });
  }

  static async analyze(text: string) {
    return withTelemetry("analyzeExpression", async () => {
      try {
        return await ExpressionService.analyzeExpression(text);
      } catch (error) {
        console.error(`[Controller] Analysis failed for "${text}":`, error);
        return null;
      }
    }, { text });
  }

  static async getAll() {
    return withTelemetry("getExpressions", () => ExpressionService.getExpressions());
  }

  static async delete(id: string) {
    return withTelemetry("deleteExpression", () => ExpressionService.deleteExpression(id), { id });
  }
}
