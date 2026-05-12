import { IJournalRepository } from "../domain/repositories/IJournalRepository";
import { IJournalAnalyzer } from "../domain/interfaces/IJournalAnalyzer";
import { JournalEntry, CreateJournalEntryDto } from "@/shared/types/journal";

/**
 * Service to handle Journal business logic
 */
export class JournalService {
  constructor(
    private repository: IJournalRepository,
    private analyzer: IJournalAnalyzer
  ) {}

  async createEntry(userId: string, data: CreateJournalEntryDto): Promise<JournalEntry> {
    return this.repository.save(userId, data);
  }

  async analyzeEntry(id: string): Promise<JournalEntry> {
    const entry = await this.repository.findById(id);
    if (!entry) throw new Error("Journal entry not found");

    // 1. Perform Linguistic Analysis via AI
    const analysis = await this.analyzer.analyze(entry.content, entry.cefrLevel || "B1");

    // 2. Persist the corrections found
    await this.repository.addCorrections(id, analysis.corrections);

    // 3. Update entry with analysis metadata
    const updated = await this.repository.update(id, {
      cefrLevel: analysis.cefrLevel,
      metadata: {
        metrics: analysis.metrics,
        recurringErrors: analysis.recurringErrors,
        suggestedVocab: analysis.suggestedVocab,
        feedback: analysis.feedback
      }
    });

    // Re-fetch to get nested corrections
    const finalEntry = await this.repository.findById(id);
    if (!finalEntry) throw new Error("Failed to retrieve updated entry");
    
    return finalEntry;
  }

  async getEntries(userId: string): Promise<JournalEntry[]> {
    return this.repository.findByUserId(userId);
  }

  async getEntry(id: string): Promise<JournalEntry | null> {
    return this.repository.findById(id);
  }

  async updateEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.repository.update(id, data);
  }

  async deleteEntry(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
