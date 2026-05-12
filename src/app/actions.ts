"use server";

import { ExpressionController } from "@/backend/controllers/ExpressionController";
import { StudyPerformance } from "@/shared/types/expression";


export async function analyzeExpression(text: string) {

  return ExpressionController.analyze(text);
}

export async function getExpressions() {
  return ExpressionController.getAll();
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
