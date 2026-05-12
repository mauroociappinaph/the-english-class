import { withTelemetry } from "@/backend/infrastructure/telemetry";
import { journalService } from "@/backend/infrastructure/registry";
import { CreateJournalEntryDto, JournalEntry } from "@/shared/types/journal";

/**
 * Controller to orchestrate Journal actions
 */
export class JournalController {
  static async create(userId: string, data: CreateJournalEntryDto) {
    return withTelemetry("createJournalEntry", () => journalService.createEntry(userId, data), { userId, mode: data.mode });
  }

  static async analyze(id: string) {
    return withTelemetry("analyzeJournalEntry", async () => {
      try {
        return await journalService.analyzeEntry(id);
      } catch (error) {
        console.error(`[Controller] Journal analysis failed for ID ${id}:`, error);
        return null;
      }
    }, { id });
  }

  static async getByUserId(userId: string) {
    return withTelemetry("getJournalEntries", () => journalService.getEntries(userId), { userId });
  }

  static async getById(id: string) {
    return withTelemetry("getJournalEntry", () => journalService.getEntry(id), { id });
  }

  static async update(id: string, data: Partial<JournalEntry>) {
    return withTelemetry("updateJournalEntry", () => journalService.updateEntry(id, data), { id });
  }

  static async delete(id: string) {
    return withTelemetry("deleteJournalEntry", () => journalService.deleteEntry(id), { id });
  }
}
