import { GroqExpressionResponse, AdaptivePathResponse } from "../types";

export interface ILinguisticAnalyzer {
  analyzeExpression(text: string): Promise<GroqExpressionResponse>;
  suggestRelated(failedTexts: string[]): Promise<AdaptivePathResponse>;
}
