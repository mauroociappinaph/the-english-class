export interface Expression {
  id: string;
  text: string;
  translation: string;
  meaning: string;
  secondaryMeanings?: string[];
  type: string;
  cefr: string;
  ipa?: string;
  frequency?: number;
  formality?: string;
  mnemonic?: string;
  usageTips?: {
    naturalness: string;
    commonMistake: string;
    context: string;
  };
  tenses?: Record<string, { text: string; translation: string }>;
  imageUrl?: string;
  examples?: {
    text: string;
    translation: string;
    category?: string;
    explanation?: string;
  }[];
  status: 'pending' | 'learning' | 'mastered';
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

