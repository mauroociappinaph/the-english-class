import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JournalService } from '../JournalService';
import { IJournalRepository } from '@/backend/domain/repositories/IJournalRepository';
import { IJournalAnalyzer } from '@/backend/domain/interfaces/IJournalAnalyzer';
import { JournalEntry, Correction, ErrorType } from "@/shared/types/journal";

describe('JournalService', () => {
  let mockRepository: IJournalRepository;
  let mockAnalyzer: IJournalAnalyzer;
  let service: JournalService;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      addCorrections: vi.fn(),
    } as unknown as IJournalRepository;

    mockAnalyzer = {
      analyze: vi.fn(),
    } as unknown as IJournalAnalyzer;

    service = new JournalService(mockRepository, mockAnalyzer);
  });

  describe('createEntry', () => {
    it('should call repository.save with correct data', async () => {
      const mockEntry = { id: 'entry-1', content: 'Today was a great day' } as JournalEntry;
      vi.mocked(mockRepository.save).mockResolvedValue(mockEntry);

      const result = await service.createEntry('user-1', { 
        content: 'Today was a great day', 
        mode: 'FREE_WRITING' 
      });

      expect(result.content).toBe('Today was a great day');
      expect(mockRepository.save).toHaveBeenCalledWith('user-1', {
        content: 'Today was a great day',
        mode: 'FREE_WRITING'
      });
    });
  });

  describe('analyzeEntry', () => {
    it('should analyze text and persist results', async () => {
      const mockEntry = { 
        id: 'entry-1', 
        content: 'I has a cat', 
        cefrLevel: 'A1' 
      } as JournalEntry;
      
      const mockAnalysis = {
        cefrLevel: 'A1',
        metrics: {
          grammar: 40,
          vocabulary: 50,
          coherence: 60
        },
        corrections: [
          { type: 'GRAMMAR' as ErrorType, originalText: 'cat', suggestedText: 'dog', explanation: 'why' }
        ],
        recurringErrors: [],
        feedback: 'good',
        suggestedVocab: ['feline']
      };


      (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntry);
      (mockAnalyzer.analyze as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockAnalysis);
      (mockRepository.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockEntry, metadata: {} });

      const result = await service.analyzeEntry('entry-1');

      expect(mockAnalyzer.analyze).toHaveBeenCalledWith('I has a cat', 'A1');
      expect(mockRepository.addCorrections).toHaveBeenCalledWith('entry-1', mockAnalysis.corrections);
      expect(mockRepository.update).toHaveBeenCalledWith('entry-1', expect.objectContaining({
        cefrLevel: 'A1',
        metadata: expect.objectContaining({
          metrics: mockAnalysis.metrics,
          suggestedVocab: mockAnalysis.suggestedVocab,
          feedback: mockAnalysis.feedback
        })
      }));
      expect(result).toBeDefined();
    });

    it('should throw error if entry not found', async () => {
      (mockRepository.findById as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.analyzeEntry('invalid-id')).rejects.toThrow('Journal entry not found');
    });
  });

  describe('getEntries', () => {
    it('should return entries for a user', async () => {
      const mockEntries = [{ id: '1' }, { id: '2' }] as JournalEntry[];
      (mockRepository.findByUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntries);

      const result = await service.getEntries('user-1');

      expect(result).toHaveLength(2);
      expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-1');
    });
  });
});
