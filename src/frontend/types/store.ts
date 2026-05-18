import { 
  Expression as SharedExpression, 
  StudyPerformance 
} from "@/shared/types/expression";

interface Expression extends SharedExpression {}

export { type StudyPerformance };

interface ExpressionDataState {
  expressions: Expression[];
  setExpressions: (exprs: Expression[]) => void;
  addExpression: (expr: Expression) => void;
  removeExpression: (id: string) => void;
}

interface ExpressionProcessState {
  isAnalyzing: boolean;
  currentAnalysis: Expression | null;
  setAnalyzing: (val: boolean) => void;
  setCurrentAnalysis: (analysis: Expression | null) => void;
  clearCurrentAnalysis: () => void;
}

interface ReviewSessionState {
  reviewQueue: Expression[];
  currentReviewIndex: number;
  isReviewing: boolean;
  isFlipped: boolean;
  isLoadingReview: boolean;
  isTestMode: boolean;
  isFinished: boolean;
  sessionErrors: Expression[];
  startReview: (expressions: Expression[]) => void;
  flipCard: () => void;
  toggleTestMode: () => void;
  nextCard: (updatedExpression: Expression, wasError?: boolean) => void;
  endReview: () => void;
}

export interface AdaptivePathResponse {
  diagnosis: string;
  recommendedExpressions: {
    text: string;
    reason: string;
    level: string;
  }[];
  learningTip: string;
}

export interface StudyState extends ExpressionDataState, ExpressionProcessState, ReviewSessionState {}
