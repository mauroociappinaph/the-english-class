import { prisma } from "../db";
import { IAchievementRepository } from "../../domain/repositories/IAchievementRepository";
import { Achievement, CreateAchievementDto } from "../../domain/types/achievement";
import { Prisma } from "@prisma/client";

export class PrismaAchievementRepository implements IAchievementRepository {
  async findAll(): Promise<Achievement[]> {
    const data = await prisma.achievement.findMany({
      orderBy: { unlockedAt: 'desc' }
    });
    return data as unknown as Achievement[];
  }

  async create(data: CreateAchievementDto): Promise<Achievement> {
    const created = await prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        type: data.type,
        icon: data.icon || 'Sparkles',
        unlockedAt: data.unlockedAt || new Date()
      }
    });
    return created as unknown as Achievement;
  }
}
