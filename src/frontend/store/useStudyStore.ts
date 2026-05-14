import { create } from 'zustand';
import { StudyState, ExpressionDataState, ExpressionProcessState, ReviewSessionState } from '@/frontend/types/store';

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

  // Review session
  reviewQueue: [],
  currentReviewIndex: 0,
  isReviewing: false,
  isFlipped: false,
  isLoadingReview: false,
  startReview: (expressions) => set({
    reviewQueue: expressions,
    currentReviewIndex: 0,
    isReviewing: true,
    isFlipped: false,
    isLoadingReview: false,
  }),
  flipCard: () => set((state) => ({ isFlipped: !state.isFlipped })),
  nextCard: (updatedExpression) => set((state) => {
    const nextIndex = state.currentReviewIndex + 1;
    const isFinished = nextIndex >= state.reviewQueue.length;

    // Update the expression in the main list too
    const updatedExpressions = state.expressions.map(e =>
      e.id === updatedExpression.id ? updatedExpression : e
    );

    return {
      currentReviewIndex: isFinished ? 0 : nextIndex,
      isReviewing: !isFinished,
      isFlipped: false,
      expressions: updatedExpressions,
    };
  }),
  endReview: () => set({
    reviewQueue: [],
    currentReviewIndex: 0,
    isReviewing: false,
    isFlipped: false,
  }),
}));
