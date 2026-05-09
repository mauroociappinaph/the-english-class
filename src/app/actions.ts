"use server";

import { prisma } from "@/lib/db";
import { groq } from "@/lib/groq";

export async function getExpression(text: string) {
  const normalizedText = text.toLowerCase().trim();
  
  const expression = await prisma.expression.findUnique({
    where: { text: normalizedText },
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
  const normalizedText = text.toLowerCase().trim();
  
  // 1. Check if it exists in DB
  const existing = await getExpression(normalizedText);
  if (existing) return existing;

  // 2. Call Groq for analysis
  try {
    const prompt = `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.

RULES:
- "translation": Provide a natural Spanish translation.
- "meaning": Provide a clear explanation in ENGLISH.
- "secondaryMeanings": Provide other meanings in ENGLISH.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": All examples must be in ENGLISH.
- "examples": All texts and explanations must be in ENGLISH.

Expression: "${normalizedText}"

Schema:
{
  "translation": "natural Spanish translation",
  "meaning": "clear explanation in English",
  "secondaryMeanings": ["optional", "other", "meanings in English"],
  "type": "verb | phrasal_verb | idiom | expression | tense",
  "cefr": "A1 | A2 | B1 | B2 | C1 | C2",
  "ipa": "/phonetic transcription/",
  "frequency": 0.0 to 1.0,
  "formality": "formal | informal | neutral",
  "usageTips": {
    "naturalness": "English description",
    "commonMistake": "English description",
    "context": "English description"
  },
  "tenses": {
    "present": "Example in English",
    "past": "Example in English",
    "presentPerfect": "Example in English",
    "future": "Example in English"
  },
  "examples": [
    { "text": "natural example 1 in English", "category": "cotidiano", "explanation": "English explanation" },
    { "text": "advanced example 2 in English", "category": "avanzado", "explanation": "English explanation" },
    { "text": "dialectal/slang example 3 in English", "category": "dialectal", "explanation": "English explanation" }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    // 3. Save to DB
    const newExpression = await prisma.expression.create({
      data: {
        text: normalizedText,
        translation: result.translation || "",
        meaning: result.meaning || "",
        secondaryMeanings: JSON.stringify(result.secondaryMeanings || []),
        type: result.type || "expression",
        cefr: result.cefr || "B1",
        ipa: result.ipa || "",
        frequency: result.frequency || 0.5,
        formality: result.formality || "neutral",
        usageTips: JSON.stringify(result.usageTips || {}),
        tenses: JSON.stringify(result.tenses || {}),
        examples: {
          create: (result.examples || []).map((ex: any) => ({
            text: ex.text,
            category: ex.category,
            explanation: ex.explanation
          }))
        }
      },
      include: { examples: true }
    });

    return {
      ...newExpression,
      secondaryMeanings: JSON.parse(newExpression.secondaryMeanings || "[]"),
      usageTips: JSON.parse(newExpression.usageTips || "{}"),
      tenses: JSON.parse(newExpression.tenses || "{}"),
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    return null;
  }
}

export async function getExpressions() {
  const expressions = await prisma.expression.findMany({
    include: { examples: true },
    orderBy: { createdAt: "desc" },
  });

  return expressions.map(ex => ({
    ...ex,
    secondaryMeanings: JSON.parse(ex.secondaryMeanings || "[]"),
    usageTips: JSON.parse(ex.usageTips || "{}"),
    tenses: JSON.parse(ex.tenses || "{}"),
  }));
}

export async function deleteExpression(id: string) {
  // First delete related examples
  await prisma.example.deleteMany({
    where: { expressionId: id },
  });

  await prisma.expression.delete({
    where: { id },
  });
}
