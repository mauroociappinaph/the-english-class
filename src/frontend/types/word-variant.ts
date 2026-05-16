import { WordVariant, WordFamilies } from "@/shared/types/expression";

export type Register = 
  | "formal" 
  | "informal" 
  | "spoken" 
  | "business" 
  | "academic" 
  | "casual conversation" 
  | "literary" 
  | "slang";

export interface HumanContextProps {
  variant: WordVariant;
}

export interface MorphologyTreeProps {
  families: WordFamilies;
  rootWord: string;
}

export interface RegisterSpectrumProps {
  registers: Register[];
}
