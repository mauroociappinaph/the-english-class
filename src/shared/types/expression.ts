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
  literalTranslation?: string | null;
  subtitleAdaptation?: string | null;
  tone?: string | null;
  register?: string | null;
  category?: string | null;
  explanation?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StudyPerformance = 'hard' | 'good' | 'easy';

export type SlangTag =
  | 'slang'
  | 'formal'
  | 'offensive'
  | 'old-fashioned'
  | 'internet-slang'
  | 'regional'
  | 'colloquial'
  | 'vulgar';

export type FormalityLevel = 'formal' | 'neutral' | 'informal' | 'slang' | 'offensive' | 'old-fashioned';

/** 0 = standard English, 3 = heavy slang */
export type SlangLevel = 0 | 1 | 2 | 3;

export interface RegionalVariant {
  region: string;             // "American English"
  subregion?: string;         // "AAVE", "Cockney", "Southern English"
  country: string;            // "United States"
  flag: string;               // "🇺🇸"
  word: string;               // equivalent word/expression in that variant
  pronunciation?: string;     // informal phonetic: "uh-PART-ment"
  ipa?: string;               // "/əˈpɑːrtmənt/"
  formality: FormalityLevel;
  slangLevel: SlangLevel;
  culturalNote: string;       // cultural context in English
  usageContext: string;       // when/where it's used
  example: string;            // real English example sentence
  exampleTranslation: string; // Spanish translation of example
  tags: SlangTag[];
  audioLocale?: string;       // Web Speech API locale: 'en-US', 'en-GB', 'en-AU'
}

export interface SlangData {
  regionalVariants: RegionalVariant[];
  detectedSlangLevel: SlangLevel;
  isSlang: boolean;
  similarWords: string[];
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
  imageUrl?: string | null;
  usageTips: UsageTips | null;
  tenses: Record<string, Tense> | null;
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
  slangData?: SlangData | null;
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
