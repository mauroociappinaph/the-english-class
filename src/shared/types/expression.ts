/**
 * Shared Expression types between Frontend and Backend
 */

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'NOT_CLASSIFIED' | 'UNKNOWN';

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


export interface WordVariant {
  word: string;
  pronunciation: string;
  cefr: CefrLevel; // A1-C2 or UNKNOWN
  isAiEstimated?: boolean;
  translation: string;
  simpleExplanation: string;
  differenceWithSimilar?: string;
  examples: Example[];
  grammarExplanation: string;
  commonCollocations: string[];
  synonyms: string[];
  antonyms: string[];
  commonMistakes: string;
  naturalContexts: ("formal" | "informal" | "business" | "academic" | "casual conversation")[];
  patterns: string[]; // e.g. ["favor", "favorable", "favorably"]
  morphology: {
    prefix?: string;
    suffix?: string;
    root: string;
  };
  tips: string[]; // e.g. ["Used mostly in spoken English"]
}

export interface WordFamilies {
  noun?: WordVariant[];
  verb?: WordVariant[];
  adjective?: WordVariant[];
  adverb?: WordVariant[];
}

interface Collocation {
  phrase: string;
  frequency: 'high' | 'medium' | 'low';
  naturalness: number; // 0-100
  usageContext: 'formal' | 'informal' | 'spoken' | 'business' | 'academic';
  example: string;
  translation: string;
  usageNote?: string;
}

export interface PhrasalVerbDetails {
  verb: string;
  particle: string;
  separable: 'no' | 'optional' | 'mandatory';
  transitive: boolean;
  
  // Pedagogical metadata
  logicExplanation: string;
  transitiveExplanation: string;
  separabilityExplanation: string;
  
  // Structural examples for visual logic
  validExamples: string[];
  invalidExamples: string[];
  
  collocations: Collocation[];
}

interface ExpressionCore {
  text: string;
  translation: string;
  meaning: string;
}

export interface CorrectionLayer {
  isCorrect: boolean;
  correctedText: string | null;
  explanation: string | null;
}

interface ExpressionAttributes {
  secondaryMeanings: string[];
  type: string;
  cefr: CefrLevel;
  isAiEstimated?: boolean;
  ipa: string | null;
  frequency: number | null;
  formality: string | null;
  mnemonic: string | null;
  imageUrl?: string | null;
  correction?: CorrectionLayer | null;
}

export interface ChronologyModule {
  tense: string;
  example: string;
  simpleExplanation: string;
  technicalExplanation: string;
  visualTimelinePoint: number; 
  grammarTags: string[];
  visualIndicators?: string[]; // e.g. ["completed", "bridge", "prediction"]
}

export interface ChronologyData {
  retrospective: {
    pastSimple: ChronologyModule;
    pastPerfect: ChronologyModule;
  };
  active: {
    presentSimple: ChronologyModule;
    presentPerfect: ChronologyModule;
  };
  projection: {
    futureSimple: ChronologyModule;
  };
}

interface ExpressionLinguistics {
  usageTips: UsageTips | null;
  tenses: Record<string, Tense> | null;
  wordFamilies: WordFamilies | null;
  phrasalVerbDetails: PhrasalVerbDetails | null;
  chronology?: ChronologyData | null;
  examples: Example[];
}

interface ExpressionStudy {
  status?: 'pending' | 'learning' | 'mastered' | null;
  difficulty?: number;
  timesStudied?: number;
  nextReviewAt?: Date | string;
  interval?: number;
  easiness?: number;
}

export interface Expression extends ExpressionCore {
  id: string;
  metadata: ExpressionAttributes;
  linguistics: ExpressionLinguistics;
  study: ExpressionStudy;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type CreateExpressionDto = ExpressionCore & {
  metadata: ExpressionAttributes;
  linguistics: Omit<ExpressionLinguistics, 'examples'> & {
    examples: Omit<Example, 'id' | 'expressionId' | 'createdAt' | 'updatedAt'>[];
  };
};
