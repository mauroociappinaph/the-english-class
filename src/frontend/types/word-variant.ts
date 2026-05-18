import { WordFamilies, WordVariant } from '@/shared/types/expression';

export interface HumanContextProps {
  variant: WordVariant;
}

export interface MorphologyTreeProps {
  families: WordFamilies;
  rootWord: string;
}

export type Register = "formal" | "informal" | "spoken" | "business" | "academic" | "casual conversation" | "literary" | "slang";

export interface RegisterSpectrumProps {
  registers: Register[];
}
