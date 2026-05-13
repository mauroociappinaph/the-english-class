import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpressionService } from '../ExpressionService';
import { IExpressionRepository } from '@/backend/domain/repositories/IExpressionRepository';
import { ILinguisticAnalyzer } from '@/backend/domain/interfaces/ILinguisticAnalyzer';
import { ExpressionDetail } from '@/backend/domain/types';

describe('ExpressionService', () => {
  let mockRepository: IExpressionRepository;
  let mockAnalyzer: ILinguisticAnalyzer;
  let service: ExpressionService;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRepository = {
      findByText: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as IExpressionRepository;

    mockAnalyzer = {
      analyzeExpression: vi.fn(),
    } as unknown as ILinguisticAnalyzer;

    service = new ExpressionService(mockRepository, mockAnalyzer);
  });

  describe('getExpression', () => {
    it('should return formatted expression when found in DB', async () => {
      const mockExpression = {
        id: '1',
        text: 'is packed with',
        translation: 'está lleno de',
        meaning: 'to be very full of something',
        metadata: {
          secondaryMeanings: [],
        },
        linguistics: {
          usageTips: { context: 'informal' },
          tenses: {},
          examples: [],
        },
        study: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as ExpressionDetail;

      (mockRepository.findByText as ReturnType<typeof vi.fn>).mockResolvedValue(mockExpression);

      const result = await service.getExpression('is packed with');

      expect(result).not.toBeNull();
      expect(result?.text).toBe('is packed with');
      expect(result?.linguistics.usageTips).toEqual({ context: 'informal' });
      expect(mockRepository.findByText).toHaveBeenCalledWith('is packed with');
    });

    it('should return null when expression is not found', async () => {
      (mockRepository.findByText as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await service.getExpression('nonexistent');

      expect(result).toBeNull();
      expect(mockRepository.findByText).toHaveBeenCalledWith('nonexistent');
    });
  });
});
