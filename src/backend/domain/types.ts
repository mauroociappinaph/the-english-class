import { 
  Expression as SharedExpression, 
  Example as SharedExample,
  UsageTips as SharedUsageTips,
  Tense as SharedTense,
  CreateExpressionDto as SharedCreateExpressionDto,
  WordFamilies,
  PhrasalVerbDetails,
  ChronologyData,
  CefrLevel
} from "@/shared/types/expression";

export type { CefrLevel };

export interface GroqExample extends Omit<SharedExample, 'id' | 'expressionId' | 'createdAt' | 'updatedAt'> {}

interface GroqTense extends SharedTense {}

interface GroqUsageTips extends SharedUsageTips {}

export interface GroqExpressionResponse {
  text: string;
  translation: string;
  meaning: string;
  secondaryMeanings: string[];
  type: string;
  cefr: string;
  ipa: string;
  frequency: number;
  formality: string;
  mnemonic: string;
  imageUrl: string | null;
  correction: {
    isCorrect: boolean;
    correctedText: string | null;
    explanation: string | null;
  } | null;
  usageTips: GroqUsageTips;
  tenses: Record<string, GroqTense>;
  wordFamilies: WordFamilies;
  phrasalVerbDetails: PhrasalVerbDetails;
  chronology: ChronologyData;
  examples: GroqExample[];
}


export interface ExpressionDetail extends SharedExpression {}

export type Expression = SharedExpression;
export type CreateExpressionDto = SharedCreateExpressionDto;
export interface AdaptivePathResponse {
  diagnosis: string;
  recommendedExpressions: {
    text: string;
    reason: string;
    level: string;
  }[];
  learningTip: string;
}
