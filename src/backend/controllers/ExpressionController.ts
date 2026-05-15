import { withTelemetry } from "@/backend/infrastructure/telemetry";
import { expressionService, achievementService } from "@/backend/infrastructure/registry";
import { StudyPerformance } from "@/shared/types/expression";
import { AnalysisResponse, AnalysisError, AnalysisErrorCode } from "@/shared/types/analysis";
import { AnalysisPipelineError } from "../services/ExpressionService";

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

  static async analyze(text: string): Promise<AnalysisResponse<import("../domain/types").ExpressionDetail>> {
    console.log(`[Controller] Starting analysis for: "${text}"`);
    return withTelemetry("analyzeExpression", async () => {
      try {
        const result = await expressionService.analyzeExpression(text);
        // Fire and forget achievement check
        achievementService.checkAchievements().catch(e => console.error("Achievement sync failed", e));
        return { success: true, data: result };
      } catch (error) {
        console.error(`[Controller] Analysis failed for "${text}":`, error);
        
        let code: AnalysisErrorCode = "UNKNOWN";
        let pedagogicalTip = "Tuvimos un problema técnico. ¿Podés intentar de nuevo?";
        
        if (error && typeof error === 'object' && 'code' in error && (error as Record<string, unknown>).name === 'AnalysisPipelineError') {
          const pipelineError = error as { code: AnalysisErrorCode };
          code = pipelineError.code;
          switch (code) {
            case "INPUT_TOO_SHORT":
              pedagogicalTip = "La frase es muy corta. ¡Intentá con algo un poco más completo!";
              break;
            case "INPUT_NONSENSE":
              pedagogicalTip = "No pude reconocer palabras en inglés. Revisá si hay algún error de tipeo.";
              break;
            case "PROVIDER_TIMEOUT":
              pedagogicalTip = "El motor neuronal está lento hoy. ¡Probá de nuevo en unos segundos!";
              break;
            case "PROVIDER_RATE_LIMIT":
              pedagogicalTip = "¡Mucho tráfico! Estamos calibrando los servidores. Esperá un ratito.";
              break;
            case "PARSING_FAILURE":
              pedagogicalTip = "La estructura de esta frase confundió a mis algoritmos. ¿Podés simplificarla?";
              break;
          }
        }

        const errorResponse: AnalysisResponse<unknown> = { 
          success: false, 
          error: {
            code,
            message: error instanceof Error ? error.message : String(error),
            pedagogicalTip
          }
        };
        console.log(`[Controller] Returning error response:`, JSON.stringify(errorResponse, null, 2));
        return errorResponse as AnalysisResponse<import("../domain/types").ExpressionDetail>;
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
    return withTelemetry("submitReview", async () => {
      const result = await expressionService.submitReview(id, performance);
      // Fire and forget achievement check after potential mastery change
      achievementService.checkAchievements().catch(e => console.error("Achievement sync failed", e));
      return result;
    }, { id, performance });
  }

  static async delete(id: string) {
    return withTelemetry("deleteExpression", () => expressionService.deleteExpression(id), { id });
  }

  static async getAdaptivePath(failedIds: string[]) {
    return withTelemetry("getAdaptivePath", () => expressionService.getAdaptivePath(failedIds), { failedIds });
  }
}
