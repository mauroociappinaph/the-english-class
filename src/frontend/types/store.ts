import { Expression as SharedExpression } from "@/shared/types/expression";

export interface Expression extends SharedExpression {}

export interface StudyState {
  expressions: Expression[];
  isAnalyzing: boolean;
  currentAnalysis: Expression | null;
  setExpressions: (exprs: Expression[]) => void;
  addExpression: (expr: Expression) => void;
  removeExpression: (id: string) => void;
  setAnalyzing: (val: boolean) => void;
  setCurrentAnalysis: (analysis: Expression | null) => void;
}
