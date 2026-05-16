import { GroqExpressionResponse, AdaptivePathResponse } from "../types";

export interface ILinguisticAnalyzer {
  analyzeExpression(text: string): Promise<GroqExpressionResponse>;
  analyzeExpressionBasic(text: string): Promise<Partial<GroqExpressionResponse>>;
  suggestRelated(failedTexts: string[]): Promise<AdaptivePathResponse>;
}
