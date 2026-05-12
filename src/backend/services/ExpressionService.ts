import { IExpressionRepository } from "../domain/repositories/IExpressionRepository";
import { ILinguisticAnalyzer } from "../domain/interfaces/ILinguisticAnalyzer";
import { ExpressionDetail, GroqExample } from "../domain/types";
import { CollisionError } from "../domain/errors";
import { StudyPerformance } from "@/shared/types/expression";

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

  async analyzeExpression(text: string): Promise<ExpressionDetail> {
    const normalizedText = text.toLowerCase().trim();
    
    // 1. Check if it exists in DB
    const existing = await this.getExpression(normalizedText);
    if (existing) return existing;

    // 2. Call Linguistic Analyzer
    const result = await this.analyzer.analyzeExpression(normalizedText);

    // 3. Save to DB with collision handling
    try {
      return await this.repository.save({
        text: normalizedText,
        translation: result.translation || "",
        meaning: result.meaning || "",
        secondaryMeanings: result.secondaryMeanings || [],
        type: result.type || "expression",
        cefr: result.cefr || "B1",
        ipa: result.ipa || "",
        frequency: result.frequency || 0.5,
        formality: result.formality || "neutral",
        mnemonic: result.mnemonic || "",
        imageUrl: result.imageUrl || null,
        usageTips: {
          naturalness: result.usageTips?.naturalness || "",
          commonMistake: result.usageTips?.commonMistake || "",
          context: result.usageTips?.context || ""
        },
        tenses: {
          present: result.tenses?.present || { text: "", translation: "" },
          past: result.tenses?.past || { text: "", translation: "" },
          presentPerfect: result.tenses?.presentPerfect || { text: "", translation: "" },
          future: result.tenses?.future || { text: "", translation: "" }
        },
        wordFamilies: result.wordFamilies || null,
        examples: (result.examples || []).map((ex: GroqExample) => ({
          text: ex.text,
          translation: ex.translation,
          category: ex.category,
          explanation: ex.explanation
        }))
      });
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
