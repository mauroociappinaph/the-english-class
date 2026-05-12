import { LinguisticAnalysis } from "@/shared/types/journal";

export interface IJournalAnalyzer {
  analyze(text: string, userLevel?: string): Promise<LinguisticAnalysis>;
}
