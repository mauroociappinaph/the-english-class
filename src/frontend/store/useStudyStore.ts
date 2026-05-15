import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StudyState } from '@/frontend/types/store';

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
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
      clearCurrentAnalysis: () => set({ currentAnalysis: null }),

      // Review session
      reviewQueue: [],
      currentReviewIndex: 0,
      isReviewing: false,
      isFlipped: false,
      isLoadingReview: false,
      isTestMode: false,
      isFinished: false,
      sessionErrors: [],
      startReview: (expressions) => set({
        reviewQueue: expressions,
        currentReviewIndex: 0,
        isReviewing: true,
        isFlipped: false,
        isLoadingReview: false,
        isFinished: false,
        sessionErrors: [],
      }),
      flipCard: () => set((state) => ({ isFlipped: !state.isFlipped })),
      toggleTestMode: () => set((state) => ({ isTestMode: !state.isTestMode, isFlipped: false })),
      nextCard: (updatedExpression, wasError) => set((state) => {
        const nextIndex = state.currentReviewIndex + 1;
        const isFinished = nextIndex >= state.reviewQueue.length;

        const updatedExpressions = state.expressions.map(e =>
          e.id === updatedExpression.id ? updatedExpression : e
        );

        const newErrors = wasError 
          ? [...state.sessionErrors, state.reviewQueue[state.currentReviewIndex]]
          : state.sessionErrors;

        return {
          currentReviewIndex: isFinished ? state.currentReviewIndex : nextIndex,
          isReviewing: true,
          isFinished,
          isFlipped: false,
          expressions: updatedExpressions,
          sessionErrors: newErrors,
        };
      }),
      endReview: () => set({
        reviewQueue: [],
        currentReviewIndex: 0,
        isReviewing: false,
        isFlipped: false,
        isFinished: false,
        sessionErrors: [],
      }),
    }),
    {
      name: 'chronos-study-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        expressions: state.expressions,
        currentAnalysis: state.currentAnalysis 
      }),
    }
  )
);
