export interface StudyMetadata {
  status: 'pending' | 'learning' | 'mastered';
  difficulty: number;
  timesStudied: number;
  nextReviewAt: Date;
  interval: number;
  easiness: number;
}
