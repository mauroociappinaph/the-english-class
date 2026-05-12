import { JournalEntry, CreateJournalEntryDto, Correction } from "@/shared/types/journal";

export interface IJournalRepository {
  findById(id: string): Promise<JournalEntry | null>;
  findByUserId(userId: string): Promise<JournalEntry[]>;
  save(userId: string, entry: CreateJournalEntryDto): Promise<JournalEntry>;
  update(id: string, data: Partial<JournalEntry>): Promise<JournalEntry>;
  delete(id: string): Promise<void>;
  addCorrections(entryId: string, corrections: Partial<Correction>[]): Promise<void>;

}
