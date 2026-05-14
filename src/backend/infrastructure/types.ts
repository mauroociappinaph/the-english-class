import { Prisma } from "@prisma/client";

export type PrismaJournalWithCorrections = Prisma.JournalEntryGetPayload<{
  include: { corrections: true }
}>;

export interface FallbackOptions {
  timeoutMs?: number;
}
