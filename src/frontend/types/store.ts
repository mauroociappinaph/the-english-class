import { 
  Expression as SharedExpression, 
  StudyPerformance, 
  RegionalVariant,
  FormalityLevel 
} from "@/shared/types/expression";

export interface Expression extends SharedExpression {}

export { type StudyPerformance, type RegionalVariant };

export interface SlangState {
  // Filters
  activeRegion: string | null;
  formalityFilter: FormalityLevel | null;
  showSlangOnly: boolean;

  // Compare mode
  compareMode: boolean;
  compareVariants: [string | null, string | null]; // region names

  // Persistent
  searchHistory: string[];
  favorites: string[]; // expression ids

  // Actions
  setRegionFilter: (region: string | null) => void;
  setFormalityFilter: (level: FormalityLevel | null) => void;
  setShowSlangOnly: (val: boolean) => void;
  toggleCompareMode: () => void;
  setCompareVariant: (slot: 0 | 1, region: string | null) => void;
  addToHistory: (text: string) => void;
  toggleFavorite: (id: string) => void;
  clearFilters: () => void;
}

export interface ExpressionDataState {
  expressions: Expression[];
  setExpressions: (exprs: Expression[]) => void;
  addExpression: (expr: Expression) => void;
  removeExpression: (id: string) => void;
}

export interface ExpressionProcessState {
  isAnalyzing: boolean;
  currentAnalysis: Expression | null;
  setAnalyzing: (val: boolean) => void;
  setCurrentAnalysis: (analysis: Expression | null) => void;
}

export interface ReviewSessionState {
  reviewQueue: Expression[];
  currentReviewIndex: number;
  isReviewing: boolean;
  isFlipped: boolean;
  isLoadingReview: boolean;
  isTestMode: boolean;
  startReview: (expressions: Expression[]) => void;
  flipCard: () => void;
  toggleTestMode: () => void;
  nextCard: (updatedExpression: Expression) => void;
  endReview: () => void;
}

export interface StudyState extends ExpressionDataState, ExpressionProcessState, ReviewSessionState {}
