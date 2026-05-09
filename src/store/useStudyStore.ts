import { create } from 'zustand';

interface Expression {
  id: string;
  text: string;
  translation: string;
  meaning: string;
  type: string;
  cefr: string;
  ipa?: string;
  status: 'pending' | 'learning' | 'mastered';
}

interface StudyState {
  expressions: Expression[];
  isAnalyzing: boolean;
  currentAnalysis: any | null;
  setExpressions: (exprs: Expression[]) => void;
  addExpression: (expr: Expression) => void;
  setAnalyzing: (val: boolean) => void;
  setCurrentAnalysis: (analysis: any) => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  expressions: [],
  isAnalyzing: false,
  currentAnalysis: null,
  setExpressions: (exprs) => set({ expressions: exprs }),
  addExpression: (expr) => set((state) => ({ expressions: [expr, ...state.expressions] })),
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
}));
