export interface Expression {
  id: string;
  text: string;
  translation: string;
  meaning: string;
  secondaryMeanings?: string[] | null;
  type: string;
  cefr: string;
  ipa?: string | null;
  frequency?: number | null;
  formality?: string | null;
  mnemonic?: string | null;
  usageTips?: {
    naturalness: string;
    commonMistake: string;
    context: string;
  } | null;
  tenses?: Record<string, { text: string; translation: string }> | null;
  imageUrl?: string | null;
  examples?: {
    text: string;
    translation: string;
    category?: string | null;
    explanation?: string | null;
  }[] | null;
  status?: 'pending' | 'learning' | 'mastered' | null;
  createdAt?: Date;
  updatedAt?: Date;
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
}
