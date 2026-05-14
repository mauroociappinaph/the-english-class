import { StudyPerformance } from "@/shared/types/expression";

export interface StudyMetadata {
  status: 'pending' | 'learning' | 'mastered';
  difficulty: number;
  timesStudied: number;
  nextReviewAt: Date;
  interval: number;
  easiness: number;
}

/**
 * Spaced Repetition Engine (SM-2 Algorithm)
 * Pure domain logic for calculating the next review date and study metrics.
 */
export class SpacedRepetitionEngine {
  private static readonly MIN_EASINESS = 1.3;
  private static readonly MASTERED_THRESHOLD = 21;

  /**
   * Calculates the next state of study metadata based on performance.
   */
  static calculate(current: StudyMetadata, performance: StudyPerformance): StudyMetadata {
    const performanceScore = this.mapPerformanceToScore(performance);

    // 1. Calculate new Easiness Factor (EF)
    const newEasiness = Math.max(
      this.MIN_EASINESS,
      current.easiness + (0.1 - (5 - performanceScore) * (0.08 + (5 - performanceScore) * 0.02))
    );

    // 2. Calculate new Interval
    let newInterval: number;
    if (performanceScore < 3) {
      newInterval = 0; // Reset on failure
    } else if (current.interval === 0) {
      newInterval = 1;
    } else if (current.interval === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(current.interval * newEasiness);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    // 3. Update status and metrics
    const timesStudied = current.timesStudied + 1;
    let newStatus: 'pending' | 'learning' | 'mastered';
    
    if (newInterval >= this.MASTERED_THRESHOLD) {
      newStatus = 'mastered';
    } else if (timesStudied >= 1 || performanceScore >= 3) {
      newStatus = 'learning';
    } else {
      newStatus = 'pending';
    }

    return {
      status: newStatus,
      difficulty: performanceScore < 3 ? Math.min(current.difficulty + 1, 5) : current.difficulty,
      timesStudied,
      nextReviewAt: nextReview,
      interval: newInterval,
      easiness: newEasiness,
    };
  }

  private static mapPerformanceToScore(performance: StudyPerformance): number {
    switch (performance) {
      case 'hard': return 0;
      case 'good': return 3;
      case 'easy': return 5;
      default: return 3;
    }
  }
}
