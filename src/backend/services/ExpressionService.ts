import { IExpressionRepository } from "../domain/repositories/IExpressionRepository";
import { ILinguisticAnalyzer } from "../domain/interfaces/ILinguisticAnalyzer";
import { ISlangAnalyzer } from "../domain/interfaces/ISlangAnalyzer";
import { ExpressionDetail, GroqExample } from "../domain/types";
import { CollisionError } from "../domain/errors";
import { StudyPerformance } from "@/shared/types/expression";

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

    // 2. Call analyzers in parallel — main linguistics + slang variants
    const [result, slangData] = await Promise.all([
      this.analyzer.analyzeExpression(normalizedText),
      this.slangAnalyzer?.analyzeSlang(normalizedText).catch((err: unknown) => {
        console.warn(`[ExpressionService] Slang analysis failed for "${normalizedText}":`, err);
        return null;
      }) ?? Promise.resolve(null),
    ]);

    const expressionData: any = {
      text: normalizedText,
      translation: result.translation || "",
      meaning: result.meaning || "",
      metadata: {
        secondaryMeanings: result.secondaryMeanings || [],
        type: result.type || "expression",
        cefr: result.cefr || "B1",
        ipa: result.ipa || "",
        frequency: result.frequency || 0.5,
        formality: result.formality || "neutral",
        mnemonic: result.mnemonic || "",
        imageUrl: result.imageUrl || null,
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
    return this.repository.updateStudyProgress(id, performance);
  }

  async deleteExpression(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
