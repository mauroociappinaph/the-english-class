import { WordVariant } from "@/shared/types/expression";
import { LucideIcon } from "lucide-react";

export interface VariantHeaderProps {
  variant: WordVariant;
  category: {
    icon: LucideIcon;
    color: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export interface ExampleSectionProps {
  variant: WordVariant;
}

export interface AdvancedMechanicsProps {
  variant: WordVariant;
}

export interface MorphologyPatternProps {
  variant: WordVariant;
}

export interface EducationalInsightsProps {
  variant: WordVariant;
}
