"use server";

import { prisma } from "@/lib/db";

export async function getExpression(text: string) {
  const expression = await prisma.expression.findUnique({
    where: { text },
    include: { examples: true },
  });

  if (!expression) return null;

  return {
    ...expression,
    secondaryMeanings: JSON.parse(expression.secondaryMeanings || "[]"),
    usageTips: JSON.parse(expression.usageTips || "{}"),
    tenses: JSON.parse(expression.tenses || "{}"),
  };
}

export async function analyzeExpression(text: string) {
  // Simulate AI analysis or check DB
  const existing = await getExpression(text);
  if (existing) return existing;

  // In a real app, here we would call Gemini
  // For now, if it's not 'is packed with', we return null or a generic response
  return null;
}
