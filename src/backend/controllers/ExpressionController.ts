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
    
    try {
      return await withTelemetry("analyzeExpression", async () => {
        try {
          const result = await expressionService.analyzeExpression(text);
          
          if (!result) {
            throw new Error("Analysis engine returned no data.");
          }

          // Fire and forget achievement check
          achievementService.checkAchievements().catch(e => console.error("Achievement sync failed", e));
          
          // Deep clone to plain object to ensure Next.js serialization doesn't fail
          // Also provides a safety net against Proxy objects or circular refs
          const serializableData = JSON.parse(JSON.stringify(result));
          const response = { success: true as const, data: serializableData };
          
          console.log(`[Controller] Analysis success for "${text}". Returning serializable object.`);
          return JSON.parse(JSON.stringify(response));
        } catch (error) {
          console.error(`[Controller] Internal analysis error for "${text}":`, error);
          
          let code: AnalysisErrorCode = "UNKNOWN";
          let pedagogicalTip = "Tuvimos un problema técnico. ¿Podés intentar de nuevo?";
          
          const isPipelineError = error && typeof error === 'object' && 'code' in error && (error as Record<string, unknown>).name === 'AnalysisPipelineError';
          
          if (isPipelineError) {
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

          const errorResponse = { 
            success: false as const, 
            error: {
              code,
              message: error instanceof Error ? error.message : String(error),
              pedagogicalTip
            }
          };
          
          console.log(`[Controller] Returning handled error response for "${text}":`, JSON.stringify(errorResponse));
          return JSON.parse(JSON.stringify(errorResponse));
        }
      }, { text });
    } catch (criticalError) {
      console.error(`[Controller] CRITICAL analysis failure for "${text}":`, criticalError);
      const criticalResponse: AnalysisResponse<import("../domain/types").ExpressionDetail> = {
        success: false,
        error: {
          code: "UNKNOWN",
          message: criticalError instanceof Error ? criticalError.message : "Critical Controller Failure",
          pedagogicalTip: "El motor neuronal sufrió una falla crítica. Por favor, intentá de nuevo."
        }
      };
      return JSON.parse(JSON.stringify(criticalResponse)); // Force serialization check
    }
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
