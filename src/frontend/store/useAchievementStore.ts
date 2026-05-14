import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'CEFR' | 'FAMILY' | 'STREAK';
  unlockedAt: string;
}

interface AchievementState {
  achievements: Achievement[];
  newlyUnlocked: Achievement | null;
  setAchievements: (achievements: Achievement[]) => void;
  addAchievement: (achievement: Achievement) => void;
  clearNewNotification: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set) => ({
      achievements: [],
      newlyUnlocked: null,
      setAchievements: (achievements) => set({ achievements }),
      addAchievement: (achievement) => set((state) => ({
        achievements: [...state.achievements, achievement],
        newlyUnlocked: achievement
      })),
      clearNewNotification: () => set({ newlyUnlocked: null }),
    }),
    {
      name: 'achievement-storage',
    }
  )
);
