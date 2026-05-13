import { prisma } from "../db";
import { Prisma } from "@prisma/client";
import { PrismaJournalWithCorrections } from "../types";
import { IJournalRepository } from "../../domain/repositories/IJournalRepository";
import { 
  JournalEntry, 
  CreateJournalEntryDto, 
  JournalMode,
  ErrorType,
  Correction
} from "@/shared/types/journal";


export class PrismaJournalRepository implements IJournalRepository {
  async findById(id: string): Promise<JournalEntry | null> {
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { corrections: true },
    });
    return entry ? this.formatEntry(entry) : null;
  }

  async findByUserId(userId: string): Promise<JournalEntry[]> {
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      include: { corrections: true },
      orderBy: { createdAt: "desc" },
    });
    return entries.map(e => this.formatEntry(e));
  }

  async save(userId: string, data: CreateJournalEntryDto): Promise<JournalEntry> {
    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title: data.title || null,
        content: data.content,
        mode: data.mode,
        mood: data.mood || null,
      },
      include: { corrections: true },
    });
    return this.formatEntry(entry);
  }

  async update(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    const { corrections, metadata, ...rest } = data;
    
    // Clean data for Prisma
    const prismaData: Prisma.JournalEntryUpdateInput = {
      ...rest,
      metadata: metadata ? JSON.stringify(metadata) : null,
    };

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: prismaData,
      include: { corrections: true },
    });
    return this.formatEntry(entry);
  }

  async delete(id: string): Promise<void> {
    await prisma.journalEntry.delete({ where: { id } });
  }

  async addCorrections(entryId: string, corrections: Omit<Correction, 'id' | 'entryId' | 'isFixed'>[]): Promise<void> {
    await prisma.correction.createMany({
      data: corrections.map(c => ({
        entryId,
        type: c.type,
        originalText: c.originalText,
        suggestedText: c.suggestedText,
        explanation: c.explanation,
        rule: c.rule || null,
      })),
    });
  }

  private formatEntry(entry: PrismaJournalWithCorrections): JournalEntry {
    return {
      id: entry.id,
      userId: entry.userId,
      title: entry.title,
      content: entry.content,
      mode: entry.mode as JournalMode,
      mood: entry.mood,
      cefrLevel: entry.cefrLevel,
      metadata: entry.metadata ? JSON.parse(entry.metadata) : null,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      corrections: entry.corrections.map(c => ({
        id: c.id,
        entryId: c.entryId,
        type: c.type as ErrorType,
        originalText: c.originalText,
        suggestedText: c.suggestedText,
        explanation: c.explanation,
        rule: c.rule || undefined,
        isFixed: c.isFixed,
      })),
    };
  }
}
