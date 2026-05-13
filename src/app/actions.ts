"use server";

import { ExpressionController } from "@/backend/controllers/ExpressionController";
import { JournalController } from "@/backend/controllers/JournalController";
import { StudyPerformance } from "@/shared/types/expression";
import { CreateJournalEntryDto, JournalEntry } from "@/shared/types/journal";


export async function analyzeExpression(text: string) {
  return ExpressionController.analyze(text);
}

export async function getExpressions() {
  return ExpressionController.getAll();
}

export async function getExpressionById(id: string) {
  return ExpressionController.getById(id);
}

export async function deleteExpression(id: string) {
  return ExpressionController.delete(id);
}

export async function getReviewSession(limit: number = 12) {
  return ExpressionController.getReviewSession(limit);
}

export async function submitReview(id: string, performance: StudyPerformance) {
  return ExpressionController.submitReview(id, performance);
}


// Journal Actions
export async function createJournalEntry(data: CreateJournalEntryDto) {
  return JournalController.create("default_user", data);
}

export async function analyzeJournalEntry(id: string) {
  return JournalController.analyze(id);
}

