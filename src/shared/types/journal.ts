/**
 * Shared Journal types between Frontend and Backend
 */

export type JournalMode = 'FREE_WRITING' | 'GUIDED_PROMPT' | 'CHALLENGE' | 'EMOTIONAL';

export type ErrorType = 'GRAMMAR' | 'VOCABULARY' | 'SPELLING' | 'PUNCTUATION' | 'STYLE';

export interface Correction {
  id?: string;
  entryId?: string;
  type: ErrorType;
  originalText: string;
  suggestedText: string;
  explanation: string;
  rule?: string;
  isFixed: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string | null;
  content: string; // HTML or JSON from TipTap
  mode: JournalMode;
  mood: string | null;
  cefrLevel: string | null;
  metadata: Record<string, unknown> | null;
  corrections: Correction[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LinguisticAnalysis {
  overallLevel: string;
  vocabularyScore: number;
  accuracyScore: number;
  corrections: Omit<Correction, 'id' | 'entryId' | 'isFixed'>[];
  recurringErrors: string[];
  feedback: string;
  suggestedVocab: string[];
}

export interface CreateJournalEntryDto {
  title?: string;
  content: string;
  mode: JournalMode;
  mood?: string;
}
