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
  imageUrl?: string | null;    // Unified name
  usageTips: UsageTips | null;
  tenses: {
    present: Tense;
    past: Tense;
    presentPerfect: Tense;
    future: Tense;
  } | null;
  examples: Example[];
  status?: 'pending' | 'learning' | 'mastered' | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type CreateExpressionDto = Omit<Expression, 'id' | 'createdAt' | 'updatedAt' | 'examples'> & {
  examples: Omit<Example, 'id' | 'expressionId' | 'createdAt' | 'updatedAt'>[];
};
