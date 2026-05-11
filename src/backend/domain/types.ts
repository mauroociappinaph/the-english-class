/**
 * Core Domain Interfaces
 */

export interface GroqExample {
  text: string;
  translation: string;
  category: string;
  explanation: string;
}

export interface GroqTense {
  text: string;
  translation: string;
}

export interface GroqUsageTips {
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
