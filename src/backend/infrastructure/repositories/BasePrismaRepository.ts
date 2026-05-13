import { prisma } from "../db";

export abstract class BasePrismaRepository {
  protected async findUnique<T, R, W, I>(
    model: { findUnique: (args: { where: W; include: I }) => Promise<T | null> },
    where: W,
    include: I,
    formatter: (data: T) => R
  ): Promise<R | null> {
    const result = await model.findUnique({
      where,
      include,
    });
    return result ? formatter(result) : null;
  }

  protected async findMany<T, R, W, I, O>(
    model: { findMany: (args: { where?: W; include: I; orderBy?: O; take?: number }) => Promise<T[]> },
    where: W | undefined,
    include: I,
    orderBy: O,
    formatter: (data: T) => R,
    take?: number
  ): Promise<R[]> {
    const results = await model.findMany({
      where,
      include,
      orderBy,
      take,
    });
    return results.map((r: T) => formatter(r));
  }
}
