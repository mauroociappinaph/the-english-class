import { Expression, Example, PhrasalVerbDetails, WordFamilies, UsageTips } from "@/shared/types/expression";
import { RegionalVariant } from "@/frontend/types/store";
import { Variants } from "framer-motion";

export interface ExpressionHeroProps {
  expressionId: string;
  text: string;
  translation: string;
  type: string;
  cefr: string;
  ipa?: string | null;
  formality?: string | null;
  slangData?: {
    isSlang: boolean;
    detectedSlangLevel: number;
    regionalVariants: RegionalVariant[];
    similarWords: string[];
  } | null;
  correction?: import("@/shared/types/expression").CorrectionLayer | null;
}

export interface ExpressionMeaningProps {
  meaning: string;
  secondaryMeanings?: string[];
  mnemonic?: string;
}

export interface ExpressionMechanicsProps {
  phrasalVerbDetails?: PhrasalVerbDetails;
  wordFamilies?: WordFamilies;
}

export interface ExpressionScenariosProps {
  examples?: Example[];
  rootText: string;
}

export interface ExpressionMasteryProps {
  usageTips?: UsageTips;
  formality: string;
}

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};
