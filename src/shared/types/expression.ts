/**
 * Shared Expression types between Frontend and Backend
 */

export interface Tense {
  text: string;
  translation: string;
}

export interface UsageTips {
  naturalness: string;
  commonMistake: string;
  context: string;
}

export interface Example {
  id?: string;
  expressionId?: string;
  text: string;
  translation: string | null;
  category?: string | null;
  explanation?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StudyPerformance = 'hard' | 'good' | 'easy';

export interface Expression {
  id: string;
  text: string;
  translation: string;
  meaning: string;
  secondaryMeanings: string[];
  type: string;
  cefr: string;
  ipa: string | null;
  frequency: number | null;
  formality: string | null;
  mnemonic: string | null;
  imageUrl?: string | null;
  usageTips: UsageTips | null;
  tenses: {
    present: Tense;
    past: Tense;
    presentPerfect: Tense;
    future: Tense;
    pastPerfect?: Tense;
    presentContinuous?: Tense;
    pastContinuous?: Tense;
    futureContinuous?: Tense;
    conditional?: Tense;
  } | null;
  wordFamilies: {
    noun?: string[];
    verb?: string[];
    adjective?: string[];
    adverb?: string[];
  } | null;
  phrasalVerbDetails: {
    verb: string;
    particle: string;
    separable: 'no' | 'optional' | 'mandatory';
    transitive: boolean;
    commonCollocations: string[];
  } | null;
  examples: Example[];
  status?: 'pending' | 'learning' | 'mastered' | null;
  difficulty?: number;
  timesStudied?: number;
  nextReviewAt?: Date | string;
  interval?: number;
  easiness?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type CreateExpressionDto = Omit<Expression, 'id' | 'createdAt' | 'updatedAt' | 'examples' | 'difficulty' | 'timesStudied' | 'nextReviewAt' | 'interval' | 'easiness'> & {
  examples: Omit<Example, 'id' | 'expressionId' | 'createdAt' | 'updatedAt'>[];
};
