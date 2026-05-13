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
