import { prisma } from "../db";
import { IExpressionRepository } from "../../domain/repositories/IExpressionRepository";
import { ExpressionDetail, CreateExpressionDto } from "../../domain/types";
import { Prisma } from "@prisma/client";
import { CollisionError } from "../../domain/errors";
import { StudyMetadata } from "../../domain/types/study";

import { BasePrismaRepository } from "./BasePrismaRepository";

export class PrismaExpressionRepository extends BasePrismaRepository implements IExpressionRepository {
  private async findExpressionBy(where: Prisma.ExpressionWhereUniqueInput): Promise<ExpressionDetail | null> {
    return this.findUnique(
      prisma.expression,
      where,
      { examples: true },
      this.formatExpression.bind(this)
    );
  }

  async findByText(text: string): Promise<ExpressionDetail | null> {
    return this.findExpressionBy({ text });
  }

  async findById(id: string): Promise<ExpressionDetail | null> {
    return this.findExpressionBy({ id });
  }

  async findAll(): Promise<ExpressionDetail[]> {
    return this.findMany(
      prisma.expression,
      undefined,
      { examples: true },
      { createdAt: "desc" },
      this.formatExpression.bind(this)
    );
  }

  async findDueForReview(limit: number): Promise<ExpressionDetail[]> {
    return this.findMany(
      prisma.expression,
      { nextReviewAt: { lte: new Date() } },
      { examples: true },
      { nextReviewAt: "asc" },
      this.formatExpression.bind(this),
      limit
    );
  }

  async save(expression: CreateExpressionDto): Promise<ExpressionDetail> {
    try {
      const newExpression = await prisma.expression.create({
        data: this.mapToPrismaData(expression) as Prisma.ExpressionCreateInput,
        include: { examples: true },
      });
      return this.formatExpression(newExpression)!;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new CollisionError(`Expression "${expression.text}" already exists.`);
      }
      throw error;
    }
  }

  async update(id: string, expression: CreateExpressionDto): Promise<ExpressionDetail> {
    // Delete existing examples first for a clean state
    await prisma.example.deleteMany({ where: { expressionId: id } });

    const updated = await prisma.expression.update({
      where: { id },
      data: this.mapToPrismaData(expression, true) as Prisma.ExpressionUpdateInput,
      include: { examples: true },
    });
    return this.formatExpression(updated)!;
  }

  private mapToPrismaData(expression: CreateExpressionDto, isUpdate = false): Prisma.ExpressionCreateInput | Prisma.ExpressionUpdateInput {
    const data: Prisma.ExpressionUpdateInput & { text?: string } = {
      translation: expression.translation,
      meaning: expression.meaning,
      secondaryMeanings: JSON.stringify(expression.metadata.secondaryMeanings),
      type: expression.metadata.type,
      cefr: expression.metadata.cefr,
      ipa: expression.metadata.ipa,
      frequency: expression.metadata.frequency,
      formality: expression.metadata.formality,
      mnemonic: expression.metadata.mnemonic,
      imageUrl: expression.metadata.imageUrl,
      usageTips: JSON.stringify(expression.linguistics.usageTips),
      tenses: JSON.stringify(expression.linguistics.tenses),
      wordFamilies: JSON.stringify(expression.linguistics.wordFamilies),
      phrasalVerbDetails: JSON.stringify(expression.linguistics.phrasalVerbDetails),
      chronology: JSON.stringify(expression.linguistics.chronology),
      slangData: expression.linguistics.slangData ? JSON.stringify(expression.linguistics.slangData) : null,
      correctionData: expression.metadata.correction ? JSON.stringify(expression.metadata.correction) : null,
      examples: {
        create: expression.linguistics.examples.map(ex => ({
          text: ex.text,
          translation: ex.translation,
          category: ex.category || "cotidiano",
          explanation: ex.explanation,
        })),
      },
    };

    if (!isUpdate) {
      data.text = expression.text;
    }

    return data;
  }

  async updateStudyProgress(id: string, study: StudyMetadata): Promise<ExpressionDetail> {
    const updated = await prisma.expression.update({
      where: { id },
      data: {
        easiness: study.easiness,
        interval: study.interval,
        nextReviewAt: study.nextReviewAt,
        timesStudied: study.timesStudied,
        difficulty: study.difficulty,
        status: study.status,
      },
      include: { examples: true },
    });

    return this.formatExpression(updated)!;
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.example.deleteMany({ where: { expressionId: id } }),
      prisma.expression.delete({ where: { id } }),
    ]);
  }

  private formatExpression(expression: import("@prisma/client").Prisma.ExpressionGetPayload<{ include: { examples: true } }>): ExpressionDetail {
    return {
      id: expression.id,
      text: expression.text,
      translation: expression.translation,
      meaning: expression.meaning,
      metadata: {
        secondaryMeanings: JSON.parse(expression.secondaryMeanings || "[]"),
        type: expression.type,
        cefr: expression.cefr,
        ipa: expression.ipa,
        frequency: expression.frequency,
        formality: expression.formality,
        mnemonic: expression.mnemonic,
        imageUrl: expression.imageUrl,
        correction: expression.correctionData ? JSON.parse(expression.correctionData) : null,
      },
      linguistics: {
        usageTips: JSON.parse(expression.usageTips || "null"),
        tenses: JSON.parse(expression.tenses || "null"),
        wordFamilies: JSON.parse(expression.wordFamilies || "null"),
        phrasalVerbDetails: JSON.parse(expression.phrasalVerbDetails || "null"),
        chronology: JSON.parse(expression.chronology || "null"),
        slangData: (() => {
          const parsed = JSON.parse(expression.slangData || "null");
          if (!parsed) return null;
          return {
            regionalVariants: parsed.regionalVariants || [],
            detectedSlangLevel: parsed.detectedSlangLevel ?? 0,
            isSlang: !!parsed.isSlang,
            similarWords: parsed.similarWords || []
          };
        })(),
        examples: expression.examples,
      },
      study: {
        status: expression.status as 'pending' | 'learning' | 'mastered',
        difficulty: expression.difficulty,
        timesStudied: expression.timesStudied,
        nextReviewAt: expression.nextReviewAt,
        interval: expression.interval,
        easiness: expression.easiness,
      },
      createdAt: expression.createdAt,
      updatedAt: expression.updatedAt,
    };
  }
}
