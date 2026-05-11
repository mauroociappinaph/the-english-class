import { create } from 'zustand';
import { StudyState } from '@/frontend/types/store';

export const useStudyStore = create<StudyState>((set) => ({
  expressions: [],
  isAnalyzing: false,
  currentAnalysis: null,
  setExpressions: (exprs) => set({ expressions: exprs }),
  addExpression: (expr) => set((state) => ({ expressions: [expr, ...state.expressions] })),
  removeExpression: (id) => set((state) => ({ 
    expressions: state.expressions.filter(e => e.id !== id) 
  })),
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
}));
