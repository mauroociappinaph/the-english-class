"use server";

import { prisma } from "@/lib/db";
import { groq } from "@/lib/groq";
import { Prisma } from "@prisma/client";

/**
 * Interfaces for Type Safety
 */

interface GroqExample {
  text: string;
  translation: string;
  category: string;
  explanation: string;
}

interface GroqTense {
  text: string;
  translation: string;
}

interface GroqUsageTips {
  naturalness: string;
  commonMistake: string;
  context: string;
}

interface GroqExpressionResponse {
  translation: string;
  meaning: string;
  secondaryMeanings: string[];
  type: string;
  cefr: string;
  ipa: string;
  frequency: number;
  formality: string;
  mnemonic: string;
  imagePrompt: string;
  usageTips: GroqUsageTips;
  tenses: {
    present: GroqTense;
    past: GroqTense;
    presentPerfect: GroqTense;
    future: GroqTense;
  };
  examples: GroqExample[];
}

/**
 * Helper to format expression object consistently
 */
function formatExpression(expression: any) {
  if (!expression) return null;
  
  return {
    ...expression,
    secondaryMeanings: JSON.parse(expression.secondaryMeanings || "[]"),
    usageTips: JSON.parse(expression.usageTips || "{}"),
    tenses: JSON.parse(expression.tenses || "{}"),
  };
}

export async function getExpression(text: string) {
  const normalizedText = text.toLowerCase().trim();
  
  const expression = await prisma.expression.findUnique({
    where: { text: normalizedText },
    include: { examples: true },
  });

  return formatExpression(expression);
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
- "translation": Provide a natural Spanish translation of the expression.
- "meaning": Provide a clear explanation in ENGLISH.
- "secondaryMeanings": Provide other meanings in ENGLISH.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": Each tense must have a "text" (ENGLISH example) and a "translation" (SPANISH).
- "examples": Each example must have a "text" (ENGLISH), "translation" (SPANISH), and "explanation" (ENGLISH).

Expression: "${normalizedText}"

Schema:
{
  "translation": "Spanish translation",
  "meaning": "English explanation",
  "secondaryMeanings": ["English secondary meaning"],
  "type": "verb | phrasal_verb | idiom | expression | tense",
  "cefr": "A1 | A2 | B1 | B2 | C1 | C2",
  "ipa": "/phonetic transcription/",
  "frequency": 0.0 to 1.0,
  "formality": "formal | informal | neutral",
  "mnemonic": "a clever memory trick or mnemonic device in English to remember this expression",
  "imagePrompt": "a detailed, artistic prompt for an image generator (DALL-E/Midjourney style) that visually represents the core concept of this expression",
  "usageTips": {
    "naturalness": "English description",
    "commonMistake": "English description",
    "context": "English description"
  },
  "tenses": {
    "present": { "text": "English example", "translation": "Spanish translation" },
    "past": { "text": "English example", "translation": "Spanish translation" },
    "presentPerfect": { "text": "English example", "translation": "Spanish translation" },
    "future": { "text": "English example", "translation": "Spanish translation" }
  },
  "examples": [
    { 
      "text": "English example", 
      "translation": "Spanish translation",
      "category": "cotidiano", 
      "explanation": "English explanation" 
    }
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

    const result: GroqExpressionResponse = JSON.parse(completion.choices[0]?.message?.content || "{}");

    // 3. Save to DB with collision handling (Race Condition Fix)
    try {
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
          mnemonic: result.mnemonic || "",
          usageTips: JSON.stringify(result.usageTips || {}),
          tenses: JSON.stringify(result.tenses || {}),
          examples: {
            create: (result.examples || []).map((ex: GroqExample) => ({
              text: ex.text,
              translation: ex.translation,
              category: ex.category,
              explanation: ex.explanation
            }))
          }
        },
        include: { examples: true }
      });

      return formatExpression(newExpression);
    } catch (dbError) {
      // Handle Unique Constraint (P2002) - Someone else created it first
      if (dbError instanceof Prisma.PrismaClientKnownRequestError && dbError.code === 'P2002') {
        console.warn(`Expression "${normalizedText}" already created by another request.`);
        return getExpression(normalizedText);
      }
      throw dbError; // Rethrow other DB errors
    }

  } catch (error) {
    console.error(`Analysis failed for "${text}":`, error);
    return null;
  }
}

export async function getExpressions() {
  const expressions = await prisma.expression.findMany({
    include: { examples: true },
    orderBy: { createdAt: "desc" },
  });

  return expressions.map(formatExpression);
}

export async function deleteExpression(id: string) {
  // Use a transaction to ensure both are deleted (Atomic delete)
  await prisma.$transaction([
    prisma.example.deleteMany({ where: { expressionId: id } }),
    prisma.expression.delete({ where: { id } })
  ]);
}

