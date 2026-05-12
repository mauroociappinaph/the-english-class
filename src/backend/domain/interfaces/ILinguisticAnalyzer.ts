import { GroqExpressionResponse, SlangData } from "../types";

export interface ILinguisticAnalyzer {
  analyzeExpression(text: string): Promise<GroqExpressionResponse>;
  analyzeSlang?(text: string): Promise<SlangData>;
}
