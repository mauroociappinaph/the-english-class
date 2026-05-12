import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormalityLevel } from '@/shared/types/expression';

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

export const useSlangStore = create<SlangState>()(
  persist(
    (set) => ({
      // Filters
      activeRegion: null,
      formalityFilter: null,
      showSlangOnly: false,

      // Compare mode
      compareMode: false,
      compareVariants: [null, null],

      // Persistent
      searchHistory: [],
      favorites: [],

      // Actions
      setRegionFilter: (region) => set({ activeRegion: region }),
      setFormalityFilter: (level) => set({ formalityFilter: level }),
      setShowSlangOnly: (val) => set({ showSlangOnly: val }),

      toggleCompareMode: () =>
        set((state) => ({
          compareMode: !state.compareMode,
          compareVariants: [null, null],
        })),

      setCompareVariant: (slot, region) =>
        set((state) => {
          const updated: [string | null, string | null] = [...state.compareVariants] as [string | null, string | null];
          updated[slot] = region;
          return { compareVariants: updated };
        }),

      addToHistory: (text) =>
        set((state) => ({
          searchHistory: [
            text,
            ...state.searchHistory.filter((t) => t !== text),
          ].slice(0, 20),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      clearFilters: () =>
        set({
          activeRegion: null,
          formalityFilter: null,
          showSlangOnly: false,
        }),
    }),
    {
      name: 'slang-store',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        favorites: state.favorites,
      }),
    }
  )
);
