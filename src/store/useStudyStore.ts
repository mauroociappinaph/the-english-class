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
  addExpression: (expr: Expression) => void;
  setAnalyzing: (val: boolean) => void;
  setCurrentAnalysis: (analysis: any) => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  expressions: [],
  isAnalyzing: false,
  currentAnalysis: null,
  addExpression: (expr) => set((state) => ({ expressions: [...state.expressions, expr] })),
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
}));
