import { GroqExpressionResponse } from "../types";

export interface ILinguisticAnalyzer {
  analyzeExpression(text: string): Promise<GroqExpressionResponse>;
}
