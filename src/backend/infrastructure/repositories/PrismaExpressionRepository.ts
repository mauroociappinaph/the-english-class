import { prisma } from "../db";
import { IExpressionRepository } from "../../domain/repositories/IExpressionRepository";
import { ExpressionDetail, CreateExpressionDto } from "../../domain/types";
import { Prisma } from "@prisma/client";
import { CollisionError } from "../../domain/errors";
import { StudyPerformance } from "@/shared/types/expression";

export class PrismaExpressionRepository implements IExpressionRepository {
  async findByText(text: string): Promise<ExpressionDetail | null> {
    const expression = await prisma.expression.findUnique({
      where: { text },
      include: { examples: true },
    });
    return expression ? this.formatExpression(expression) : null;
  }

  async findAll(): Promise<ExpressionDetail[]> {
    const expressions = await prisma.expression.findMany({
      include: { examples: true },
      orderBy: { createdAt: "desc" },
    });
    return expressions.map(e => this.formatExpression(e)).filter((e): e is ExpressionDetail => e !== null);
  }

  async findDueForReview(limit: number): Promise<ExpressionDetail[]> {
    const now = new Date();
    const expressions = await prisma.expression.findMany({
      where: { nextReviewAt: { lte: now } },
      include: { examples: true },
      orderBy: { nextReviewAt: "asc" },
      take: limit,
    });
    return expressions.map(e => this.formatExpression(e)).filter((e): e is ExpressionDetail => e !== null);
  }

  async save(expression: CreateExpressionDto): Promise<ExpressionDetail> {
    try {
      const newExpression = await prisma.expression.create({
        data: {
          text: expression.text,
          translation: expression.translation,
          meaning: expression.meaning,
          secondaryMeanings: JSON.stringify(expression.secondaryMeanings),
          type: expression.type,
          cefr: expression.cefr,
          ipa: expression.ipa,
          frequency: expression.frequency,
          formality: expression.formality,
          mnemonic: expression.mnemonic,
          usageTips: JSON.stringify(expression.usageTips),
          tenses: JSON.stringify(expression.tenses),
          wordFamilies: JSON.stringify(expression.wordFamilies),
          examples: {
            create: expression.examples.map(ex => ({
              text: ex.text,
              translation: ex.translation,
              category: ex.category || "cotidiano",
              explanation: ex.explanation,
            })),
          },
        },
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

  async updateStudyProgress(id: string, performance: StudyPerformance): Promise<ExpressionDetail> {
    const current = await prisma.expression.findUniqueOrThrow({
      where: { id },
    });

    const performanceScore = performance === 'hard' ? 0 : performance === 'good' ? 3 : 5;

    // SM-2 simplified: adjust easiness factor
    const newEasiness = Math.max(
      1.3,
      current.easiness + (0.1 - (5 - performanceScore) * (0.08 + (5 - performanceScore) * 0.02))
    );

    // Calculate new interval
    let newInterval: number;
    if (performanceScore < 3) {
      newInterval = 0; // Reset on hard
    } else if (current.interval === 0) {
      newInterval = 1;
    } else if (current.interval === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(current.interval * newEasiness);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    // Determine status
    let newStatus: string;
    if (newInterval >= 21) {
      newStatus = 'mastered';
    } else if (current.timesStudied >= 1 || performanceScore >= 3) {
      newStatus = 'learning';
    } else {
      newStatus = 'pending';
    }

    const updated = await prisma.expression.update({
      where: { id },
      data: {
        easiness: newEasiness,
        interval: newInterval,
        nextReviewAt: nextReview,
        timesStudied: current.timesStudied + 1,
        difficulty: performanceScore < 3 ? Math.min(current.difficulty + 1, 5) : current.difficulty,
        status: newStatus,
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
      ...expression,
      secondaryMeanings: JSON.parse(expression.secondaryMeanings || "[]"),
      usageTips: JSON.parse(expression.usageTips || "null"),
      tenses: JSON.parse(expression.tenses || "null"),
      wordFamilies: JSON.parse(expression.wordFamilies || "null"),
      createdAt: expression.createdAt,
      updatedAt: expression.updatedAt,
      imageUrl: expression.imageUrl,
      status: expression.status as 'pending' | 'learning' | 'mastered'
    };
  }
}
