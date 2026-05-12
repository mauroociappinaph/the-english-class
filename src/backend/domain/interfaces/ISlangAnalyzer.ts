import { SlangData } from "@/shared/types/expression";

export interface ISlangAnalyzer {
  analyzeSlang(text: string): Promise<SlangData>;
}
