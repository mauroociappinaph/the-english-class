import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, AchievementState } from '../types/achievements';

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
