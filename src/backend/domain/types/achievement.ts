export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  icon?: string;
  unlockedAt: Date;
}

export type CreateAchievementDto = Omit<Achievement, 'id' | 'unlockedAt'> & {
  unlockedAt?: Date;
};
