"use server";

import { ExpressionController } from "@/backend/controllers/ExpressionController";


export async function analyzeExpression(text: string) {

  return ExpressionController.analyze(text);
}

export async function getExpressions() {
  return ExpressionController.getAll();
}

export async function deleteExpression(id: string) {
  return ExpressionController.delete(id);
}
