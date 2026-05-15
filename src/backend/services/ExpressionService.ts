import { IExpressionRepository } from "../domain/repositories/IExpressionRepository";
import { ILinguisticAnalyzer } from "../domain/interfaces/ILinguisticAnalyzer";
import { ISlangAnalyzer } from "../domain/interfaces/ISlangAnalyzer";
import { Expression, CreateExpressionDto, AdaptivePathResponse, ExpressionDetail, GroqExample } from "../domain/types";
import { CollisionError } from "../domain/errors";
import { StudyPerformance } from "@/shared/types/expression";
import { SpacedRepetitionEngine, StudyMetadata } from "../domain/logic/SpacedRepetitionEngine";
import { AnalysisErrorCode } from "@/shared/types/analysis";

export class AnalysisPipelineError extends Error {
  constructor(public code: AnalysisErrorCode, message: string) {
    super(message);
    this.name = "AnalysisPipelineError";
  }
}

/**
 * Service to handle Expression business logic
 */
export class ExpressionService {
  constructor(
    private repository: IExpressionRepository,
    private analyzer: ILinguisticAnalyzer,
    private slangAnalyzer?: ISlangAnalyzer
  ) {}

  async getExpression(text: string): Promise<ExpressionDetail | null> {
    const normalizedText = text.toLowerCase().trim();
    return this.repository.findByText(normalizedText);
  }

  async getExpressionById(id: string): Promise<ExpressionDetail | null> {
    return this.repository.findById(id);
  }

  async analyzeExpression(text: string): Promise<ExpressionDetail> {
    const normalizedText = text.toLowerCase().trim();
    
    // 1. Check if it exists in DB
    const existing = await this.getExpression(normalizedText);
    
    // Check if we need to re-analyze to get the new Chronology data
    const chronology = existing?.linguistics.chronology;
    const needsChronology = existing && (
      !chronology || 
      Object.keys(chronology).length === 0
    );

    console.log(`[ExpressionService] Analysis request for: "${normalizedText}"`);
    console.log(`[ExpressionService] Existing in DB: ${!!existing}`);
    if (existing) {
      console.log(`[ExpressionService] Has chronology: ${!!existing.linguistics.chronology}`);
    }

    if (existing && !needsChronology) {
      console.log(`[ExpressionService] Returning cached result for "${normalizedText}"`);
      return existing;
    }

    if (needsChronology) {
      console.log(`[ExpressionService] "${normalizedText}" exists but lacks chronology. FORCING RE-ANALYSIS...`);
    } else {
      console.log(`[ExpressionService] Fresh analysis for: "${normalizedText}"`);
    }

    // 2. Pre-validation: Catch nonsense or ultra-short inputs
    if (normalizedText.length < 2 && !/^[a-z0-9]$/i.test(normalizedText)) {
      throw new AnalysisPipelineError("INPUT_TOO_SHORT", "The phrase is too short to analyze.");
    }
    
    if (/^[^a-z0-9]+$/i.test(normalizedText)) {
      throw new AnalysisPipelineError("INPUT_NONSENSE", "The input contains no recognizable words.");
    }

    // 3. Multi-stage analysis
    let result: any;
    let slangData: any = null;

    try {
      console.log(`[ExpressionService] Attempting DEEP analysis for: "${normalizedText}"`);
      [result, slangData] = await Promise.all([
        this.analyzer.analyzeExpression(normalizedText),
        this.slangAnalyzer?.analyzeSlang(normalizedText).catch((err: unknown) => {
          console.warn(`[ExpressionService] Slang analysis failed for "${normalizedText}":`, err);
          return null;
        }) ?? Promise.resolve(null),
      ]);
    } catch (deepError: any) {
      console.warn(`[ExpressionService] DEEP analysis failed for "${normalizedText}". Error: ${deepError.message}. Attempting BASIC fallback...`);
      
      try {
        const basicResult = await this.analyzer.analyzeExpressionBasic(normalizedText);
        // Map basic result to full object with nulls/defaults
        result = {
          ...basicResult,
          secondaryMeanings: [],
          usageTips: { naturalness: "", commonMistake: "", context: "" },
          tenses: {},
          wordFamilies: {},
          phrasalVerbDetails: null,
          chronology: null,
          examples: []
        };
      } catch (basicError: any) {
        console.error(`[ExpressionService] BASIC analysis ALSO failed for "${normalizedText}".`);
        
        const isTimeout = deepError.message?.includes("TIMEOUT") || basicError.message?.includes("TIMEOUT");
        const isRateLimit = deepError.message?.includes("429") || basicError.message?.includes("rate limit");
        
        const errorCode: AnalysisErrorCode = isRateLimit ? "PROVIDER_RATE_LIMIT" : isTimeout ? "PROVIDER_TIMEOUT" : "PARSING_FAILURE";
        throw new AnalysisPipelineError(errorCode, `Analysis pipeline failed: ${deepError.message}`);
      }
    }

    const expressionData = {
      text: normalizedText,
      translation: result.translation || "",
      meaning: result.meaning || "",
      metadata: {
        secondaryMeanings: result.secondaryMeanings || [],
        type: result.type || "expression",
        cefr: (result.cefr?.match(/A[12]|B[12]|C[12]/i)?.[0]?.toUpperCase()) || "B1",
        ipa: result.ipa || "",
        frequency: result.frequency || 0.5,
        formality: result.formality || "neutral",
        mnemonic: result.mnemonic || "",
        imageUrl: result.imageUrl || null,
        correction: result.correction || null,
      },
      linguistics: {
        usageTips: {
          naturalness: result.usageTips?.naturalness || "",
          commonMistake: result.usageTips?.commonMistake || "",
          context: result.usageTips?.context || ""
        },
        tenses: result.tenses || null,
        wordFamilies: result.wordFamilies || null,
        phrasalVerbDetails: result.phrasalVerbDetails || null,
        chronology: result.chronology || null,
        slangData: slangData || null,
        examples: (result.examples || []).map((ex: GroqExample) => ({
          text: ex.text,
          translation: ex.translation,
          category: ex.category,
          explanation: ex.explanation
        }))
      }
    };

    // 3. Save to DB with collision handling
    try {
      if (existing) {
        return await this.repository.update(existing.id, expressionData);
      }
      return await this.repository.save(expressionData);
    } catch (error: unknown) {
      if (error instanceof CollisionError) {
        const existingAfterCollision = await this.getExpression(normalizedText);
        if (existingAfterCollision) return existingAfterCollision;
      }
      throw error;
    }
  }

  async getExpressions(): Promise<ExpressionDetail[]> {
    return this.repository.findAll();
  }

  async getReviewSession(limit: number = 12): Promise<ExpressionDetail[]> {
    return this.repository.findDueForReview(limit);
  }

  async submitReview(id: string, performance: StudyPerformance): Promise<ExpressionDetail> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new Error(`Expression with ID ${id} not found`);
    }

    // Adapt types if necessary (handle string dates from JSON)
    const currentStudy: StudyMetadata = {
      status: current.study.status || 'pending',
      difficulty: current.study.difficulty ?? 3,
      timesStudied: current.study.timesStudied ?? 0,
      nextReviewAt: typeof current.study.nextReviewAt === 'string' 
        ? new Date(current.study.nextReviewAt) 
        : current.study.nextReviewAt || new Date(),
      interval: current.study.interval ?? 0,
      easiness: current.study.easiness ?? 2.5,
    };

    const nextStudy = SpacedRepetitionEngine.calculate(currentStudy, performance);
    
    return this.repository.updateStudyProgress(id, nextStudy);
  }

  async deleteExpression(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async getAdaptivePath(failedIds: string[]): Promise<AdaptivePathResponse | null> {
    const failedExpressions = await Promise.all(
      failedIds.map(id => this.repository.findById(id))
    );
    const texts = failedExpressions.filter(Boolean).map(e => e!.text);
    
    if (texts.length === 0) return null;

    console.log(`[ExpressionService] Generating adaptive path for: ${texts.join(', ')}`);
    return this.analyzer.suggestRelated(texts);
  }
}
