import { Expression as SharedExpression, StudyPerformance } from "@/shared/types/expression";

export interface Expression extends SharedExpression {}

export { type StudyPerformance };

export interface StudyState {
  expressions: Expression[];
  isAnalyzing: boolean;
  currentAnalysis: Expression | null;
  setExpressions: (exprs: Expression[]) => void;
  addExpression: (expr: Expression) => void;
  removeExpression: (id: string) => void;
  setAnalyzing: (val: boolean) => void;
  setCurrentAnalysis: (analysis: Expression | null) => void;

  // Review session state
  reviewQueue: Expression[];
  currentReviewIndex: number;
  isReviewing: boolean;
  isFlipped: boolean;
  isLoadingReview: boolean;
  startReview: (expressions: Expression[]) => void;
  flipCard: () => void;
  nextCard: (updatedExpression: Expression) => void;
  endReview: () => void;
}
