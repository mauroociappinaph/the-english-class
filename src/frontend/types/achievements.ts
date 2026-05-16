export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'CEFR' | 'FAMILY' | 'STREAK';
  unlockedAt: string;
}

export interface AchievementState {
  achievements: Achievement[];
  newlyUnlocked: Achievement | null;
  setAchievements: (achievements: Achievement[]) => void;
  addAchievement: (achievement: Achievement) => void;
  clearNewNotification: () => void;
}
