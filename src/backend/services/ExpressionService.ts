import { IExpressionRepository } from "../domain/repositories/IExpressionRepository";
import { ILinguisticAnalyzer } from "../domain/interfaces/ILinguisticAnalyzer";
import { Expression, CreateExpressionDto, AdaptivePathResponse, ExpressionDetail, GroqExample, GroqExpressionResponse } from "../domain/types";
import { CefrLevel, WordVariant } from "@/shared/types/expression";
import { CollisionError } from "../domain/errors";
import { StudyPerformance } from "@/shared/types/expression";
import { SpacedRepetitionEngine, StudyMetadata } from "../domain/logic/SpacedRepetitionEngine";
import { AnalysisErrorCode } from "@/shared/types/analysis";
import { CefrClassifier } from "../domain/logic/CefrClassifier";

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
    private analyzer: ILinguisticAnalyzer
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
    let result: GroqExpressionResponse;
    try {
      console.log(`[ExpressionService] Attempting DEEP analysis for: "${normalizedText}"`);
      result = await this.analyzer.analyzeExpression(normalizedText);
    } catch (deepError: unknown) {
      const deepErrorMsg = deepError instanceof Error ? deepError.message : String(deepError);
      console.warn(`[ExpressionService] DEEP analysis failed for "${normalizedText}". Error: ${deepErrorMsg}. Attempting BASIC fallback...`);
      
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
        } as unknown as GroqExpressionResponse;
      } catch (basicError: unknown) {
        const basicErrorMsg = basicError instanceof Error ? basicError.message : String(basicError);
        console.error(`[ExpressionService] BASIC analysis ALSO failed for "${normalizedText}".`);
        
        const isTimeout = deepErrorMsg.includes("TIMEOUT") || basicErrorMsg.includes("TIMEOUT");
        const isRateLimit = deepErrorMsg.includes("429") || basicErrorMsg.includes("rate limit");
        
        const errorCode: AnalysisErrorCode = isRateLimit ? "PROVIDER_RATE_LIMIT" : isTimeout ? "PROVIDER_TIMEOUT" : "PARSING_FAILURE";
        throw new AnalysisPipelineError(errorCode, `Analysis pipeline failed: ${deepErrorMsg}`);
      }
    }

    const expressionData = {
      text: normalizedText,
      translation: result.translation || "",
      meaning: result.meaning || "",
      metadata: {
        secondaryMeanings: result.secondaryMeanings || [],
        type: result.type || "expression",
        cefr: this.validateCefr(result.cefr, normalizedText),
        isAiEstimated: true, // Mark as AI estimated as it comes from the analyzer
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
        wordFamilies: result.wordFamilies ? {
          noun: (result.wordFamilies.noun || []).map((v: WordVariant) => ({ ...v, cefr: this.validateCefr(v.cefr, v.word) })),
          verb: (result.wordFamilies.verb || []).map((v: WordVariant) => ({ ...v, cefr: this.validateCefr(v.cefr, v.word) })),
          adjective: (result.wordFamilies.adjective || []).map((v: WordVariant) => ({ ...v, cefr: this.validateCefr(v.cefr, v.word) })),
          adverb: (result.wordFamilies.adverb || []).map((v: WordVariant) => ({ ...v, cefr: this.validateCefr(v.cefr, v.word) })),
        } : null,
        phrasalVerbDetails: result.phrasalVerbDetails || null,
        chronology: result.chronology || null,
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

  /**
   * Validates and normalizes CEFR levels.
   * Prevents hardcoded fallbacks and ensures typed consistency.
   */
  private validateCefr(rawCefr: string | undefined | null, text: string): CefrLevel {
    const cleanText = text.trim().toLowerCase();
    
    // 1. Static lookup override
    const staticLevel = CefrClassifier.classify(cleanText);
    if (staticLevel) {
      console.log(`[ExpressionService] Static CEFR lookup override for "${cleanText}": ${staticLevel}`);
      return staticLevel;
    }

    if (!rawCefr) {
      console.warn(`[ExpressionService] No CEFR level provided by analyzer for "${cleanText}". Falling back to NOT_CLASSIFIED.`);
      return "NOT_CLASSIFIED";
    }

    const normalized = rawCefr.trim().toUpperCase();
    
    // Robust match for Cambridge levels (supports exact match or extracting first level from ranges like "B1-C2")
    const match = normalized.match(/(A1|A2|B1|B2|C1|C2)/i);
    if (match) {
      const level = match[1].toUpperCase() as CefrLevel;
      console.log(`[ExpressionService] CEFR level validated for "${cleanText}": ${level}`);
      return level;
    }

    if (normalized === "UNKNOWN" || normalized === "NOT_CLASSIFIED") {
      return normalized as CefrLevel;
    }

    console.warn(`[ExpressionService] Invalid CEFR level received for "${cleanText}": "${rawCefr}". Falling back to UNKNOWN.`);
    return "UNKNOWN";
  }
}
