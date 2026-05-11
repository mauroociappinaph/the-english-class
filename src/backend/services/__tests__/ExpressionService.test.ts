import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpressionService } from '../ExpressionService';
import { prisma } from '@/backend/infrastructure/db';
import { Expression as PrismaExpression } from '@prisma/client';

// Mock Infrastructure
vi.mock('@/backend/infrastructure/db', () => ({
  prisma: {
    expression: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/backend/infrastructure/groq', () => ({
  groq: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

describe('ExpressionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getExpression', () => {
    it('should return formatted expression when found in DB', async () => {
      const mockExpression = {
        id: '1',
        text: 'is packed with',
        translation: 'está lleno de',
        meaning: 'to be very full of something',
        secondaryMeanings: '[]',
        usageTips: '{"context": "informal"}',
        tenses: '{}',
        examples: [],
      } as unknown as PrismaExpression;

      vi.mocked(prisma.expression.findUnique).mockResolvedValue(mockExpression);

      const result = await ExpressionService.getExpression('is packed with');

      expect(result).not.toBeNull();
      expect(result?.text).toBe('is packed with');
      expect(result?.usageTips).toEqual({ context: 'informal' });
      expect(prisma.expression.findUnique).toHaveBeenCalledWith({
        where: { text: 'is packed with' },
        include: { examples: true },
      });
    });

    it('should return null when expression is not found', async () => {
      vi.mocked(prisma.expression.findUnique).mockResolvedValue(null as unknown as PrismaExpression);

      const result = await ExpressionService.getExpression('nonexistent');

      expect(result).toBeNull();
    });
  });
});
