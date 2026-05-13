import { ExpressionAnalysis, Example, PhrasalVerbDetails, WordFamily, UsageTips } from "@/shared/types/expression";

export interface ExpressionHeroProps {
  expressionId: string;
  analysis: ExpressionAnalysis;
}

export interface ExpressionMeaningProps {
  meaning: string;
  secondaryMeanings?: string[];
  mnemonic?: string;
}

export interface ExpressionMechanicsProps {
  phrasalVerbDetails?: PhrasalVerbDetails;
  wordFamilies?: WordFamily[];
}

export interface ExpressionScenariosProps {
  examples?: Example[];
}

export interface ExpressionMasteryProps {
  usageTips?: UsageTips;
  formality: string;
}
