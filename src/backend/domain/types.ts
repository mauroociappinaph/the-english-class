/**
 * Core Domain Interfaces
 */

export interface GroqExample {
  text: string;
  translation: string;
  category: string;
  explanation: string;
}

interface GroqTense {
  text: string;
  translation: string;
}

interface GroqUsageTips {
  naturalness: string;
  commonMistake: string;
  context: string;
}

export interface GroqExpressionResponse {
  translation: string;
  meaning: string;
  secondaryMeanings: string[];
  type: string;
  cefr: string;
  ipa: string;
  frequency: number;
  formality: string;
  mnemonic: string;
  imagePrompt: string;
  usageTips: GroqUsageTips;
  tenses: {
    present: GroqTense;
    past: GroqTense;
    presentPerfect: GroqTense;
    future: GroqTense;
  };
  examples: GroqExample[];
}

interface Example {
  id: string;
  expressionId: string;
  text: string;
  translation: string;
  category: string;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Expression {
  id: string;
  text: string;
  translation: string;
  meaning: string;
  secondaryMeanings: string;
  type: string;
  cefr: string;
  ipa: string;
  frequency: number;
  formality: string;
  mnemonic: string;
  usageTips: string;
  tenses: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpressionDetail extends Omit<Expression, 'secondaryMeanings' | 'usageTips' | 'tenses'> {
  secondaryMeanings: string[];
  usageTips: Record<string, unknown>;
  tenses: Record<string, unknown>;
  examples: Example[];
}

export type CreateExpressionDto = Omit<Expression, 'id' | 'createdAt' | 'updatedAt' | 'secondaryMeanings' | 'usageTips' | 'tenses'> & {
  secondaryMeanings: string[];
  usageTips: Record<string, unknown>;
  tenses: Record<string, unknown>;
  examples: Omit<Example, 'id' | 'expressionId' | 'createdAt' | 'updatedAt'>[];
};
