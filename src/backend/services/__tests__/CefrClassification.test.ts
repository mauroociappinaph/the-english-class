import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpressionService } from '../ExpressionService';
import { IExpressionRepository } from '@/backend/domain/repositories/IExpressionRepository';
import { ILinguisticAnalyzer } from '@/backend/domain/interfaces/ILinguisticAnalyzer';
import { GroqExpressionResponse, CreateExpressionDto, ExpressionDetail } from '@/backend/domain/types';
import { PhrasalVerbDetails, ChronologyData } from '@/shared/types/expression';

describe('ExpressionService CEFR Classification', () => {
  let mockRepository: IExpressionRepository;
  let mockAnalyzer: ILinguisticAnalyzer;
  let service: ExpressionService;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRepository = {
      findByText: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    } as unknown as IExpressionRepository;

    mockAnalyzer = {
      analyzeExpression: vi.fn(),
    } as unknown as ILinguisticAnalyzer;

    service = new ExpressionService(mockRepository, mockAnalyzer);
  });

  const createMockResponse = (cefr: string): GroqExpressionResponse => ({
    text: 'test',
    translation: 'prueba',
    meaning: 'test meaning',
    secondaryMeanings: [],
    type: 'verb',
    cefr: cefr,
    ipa: '/test/',
    frequency: 0.5,
    formality: 'neutral',
    mnemonic: 'test mnemonic',
    imageUrl: null,
    correction: { isCorrect: true, correctedText: null, explanation: null },
    usageTips: { naturalness: '', commonMistake: '', context: '' },
    tenses: {},
    wordFamilies: {},
    phrasalVerbDetails: null as unknown as PhrasalVerbDetails,
    chronology: {} as unknown as ChronologyData,
    examples: []
  });

  it('should correctly classify A1 level', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('A1'));
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('cat');
    expect(result.metadata.cefr).toBe('A1');
  });

  it('should correctly classify C2 level', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('C2'));
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('ubiquitous');
    expect(result.metadata.cefr).toBe('C2');
  });

  it('should fallback to UNKNOWN for invalid levels', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('Z9')); // Invalid
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('nonsense');
    expect(result.metadata.cefr).toBe('UNKNOWN');
  });

  it('should fallback to NOT_CLASSIFIED for empty response', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('')); 
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('missing');
    expect(result.metadata.cefr).toBe('NOT_CLASSIFIED');
  });

  it('should handle lowercase input correctly', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('b1')); 
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('improve');
    expect(result.metadata.cefr).toBe('B1');
  });

  it('should set isAiEstimated to true', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('B2'));
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('accurate');
    expect(result.metadata.isAiEstimated).toBe(true);
  });

  it('should override LLM hallucinations for foundational A1 words', async () => {
    vi.mocked(mockRepository.findByText).mockResolvedValue(null);
    vi.mocked(mockAnalyzer.analyzeExpression).mockResolvedValue(createMockResponse('C2')); // Hallucinated level
    vi.mocked(mockRepository.save).mockImplementation((data: CreateExpressionDto) => Promise.resolve({ ...data, id: '1', study: {} } as unknown as ExpressionDetail));

    const result = await service.analyzeExpression('how');
    expect(result.metadata.cefr).toBe('A1'); // Statically overridden to correct A1 level
  });
});
