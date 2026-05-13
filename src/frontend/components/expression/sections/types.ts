import { Expression, Example, PhrasalVerbDetails, WordFamilies, UsageTips } from "@/shared/types/expression";
import { Variants } from "framer-motion";

export interface ExpressionHeroProps {
  expressionId: string;
  analysis: Expression;
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
