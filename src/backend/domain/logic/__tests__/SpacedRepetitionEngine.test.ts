import { describe, it, expect } from 'vitest';
import { SpacedRepetitionEngine, StudyMetadata } from '../SpacedRepetitionEngine';

describe('SpacedRepetitionEngine', () => {
  const initialMetadata: StudyMetadata = {
    status: 'pending',
    difficulty: 3,
    timesStudied: 0,
    nextReviewAt: new Date(),
    interval: 0,
    easiness: 2.5,
  };

  it('should set interval to 1 on first successful study (good)', () => {
    const result = SpacedRepetitionEngine.calculate(initialMetadata, 'good');
    expect(result.interval).toBe(1);
    expect(result.status).toBe('learning');
    expect(result.timesStudied).toBe(1);
  });

  it('should reset interval on hard performance', () => {
    const learningMetadata: StudyMetadata = {
      ...initialMetadata,
      interval: 6,
      timesStudied: 2,
    };
    const result = SpacedRepetitionEngine.calculate(learningMetadata, 'hard');
    expect(result.interval).toBe(0);
    expect(result.status).toBe('learning'); // Status remains learning if studied before
  });

  it('should increase easiness on easy performance', () => {
    const result = SpacedRepetitionEngine.calculate(initialMetadata, 'easy');
    expect(result.easiness).toBeGreaterThan(2.5);
  });

  it('should reach mastered status when interval >= 21', () => {
    const advancedMetadata: StudyMetadata = {
      ...initialMetadata,
      interval: 10,
      easiness: 2.5,
      timesStudied: 5,
    };
    // If we get 'easy', new interval will be 10 * 2.6 (approx) = 26
    const result = SpacedRepetitionEngine.calculate(advancedMetadata, 'easy');
    expect(result.interval).toBeGreaterThanOrEqual(21);
    expect(result.status).toBe('mastered');
  });

  it('should handle dates correctly for next review', () => {
    const result = SpacedRepetitionEngine.calculate(initialMetadata, 'good');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    expect(result.nextReviewAt.toDateString()).toBe(tomorrow.toDateString());
  });
});
