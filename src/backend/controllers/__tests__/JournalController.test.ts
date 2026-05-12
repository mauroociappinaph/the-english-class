import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JournalController } from '../JournalController';
import { journalService } from "@/backend/infrastructure/registry";
import { JournalEntry } from "@/shared/types/journal";


// Mock the registry before any imports
vi.mock("@/backend/infrastructure/registry", () => ({
  journalService: {
    createEntry: vi.fn(),
    analyzeEntry: vi.fn(),
    getEntries: vi.fn(),
    getEntry: vi.fn(),
    updateEntry: vi.fn(),
    deleteEntry: vi.fn(),
  }
}));

describe('JournalController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should delegate creation to service', async () => {
      const mockEntry = { id: '1', content: 'hello' } as unknown as JournalEntry;
      vi.mocked(journalService.createEntry).mockResolvedValue(mockEntry);

      const result = await JournalController.create('user-1', { 
        content: 'hello', 
        mode: 'FREE_WRITING' 
      });

      expect(result).toEqual(mockEntry);
      expect(journalService.createEntry).toHaveBeenCalledWith('user-1', {
        content: 'hello',
        mode: 'FREE_WRITING'
      });
    });
  });

  describe('analyzeEntry', () => {
    it('should delegate analysis to service', async () => {
      const mockEntry = { id: '1', cefrLevel: 'B2' } as unknown as JournalEntry;
      vi.mocked(journalService.analyzeEntry).mockResolvedValue(mockEntry);

      const result = await JournalController.analyze('1');

      expect(result.cefrLevel).toBe('B2');
      expect(journalService.analyzeEntry).toHaveBeenCalledWith('1');
    });
  });

  describe('getEntries', () => {
    it('should delegate retrieval to service', async () => {
      const mockEntries = [{ id: '1' }] as unknown as JournalEntry[];
      vi.mocked(journalService.getEntries).mockResolvedValue(mockEntries);

      const result = await JournalController.getByUserId('user-1');

      expect(result).toHaveLength(1);
      expect(journalService.getEntries).toHaveBeenCalledWith('user-1');
    });
  });
});
