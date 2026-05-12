import { prisma } from "../db";
import { IExpressionRepository } from "../../domain/repositories/IExpressionRepository";
import { ExpressionDetail, CreateExpressionDto } from "../../domain/types";
import { Prisma } from "@prisma/client";
import { CollisionError } from "../../domain/errors";

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
      createdAt: expression.createdAt,
      updatedAt: expression.updatedAt,
      imageUrl: expression.imageUrl,
      status: expression.status as 'pending' | 'learning' | 'mastered'
    };
  }
}
