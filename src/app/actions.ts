"use server";
// Triggering re-compile for Prisma client sync
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
    mnemonic: expression.mnemonic,
    imageUrl: expression.imageUrl,
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
        mnemonic: result.mnemonic || "",
        usageTips: JSON.stringify(result.usageTips || {}),
        tenses: JSON.stringify(result.tenses || {}),
        examples: {
          create: (result.examples || []).map((ex: any) => ({
            text: ex.text,
            translation: ex.translation, // New field
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
      mnemonic: newExpression.mnemonic,
      imageUrl: newExpression.imageUrl
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
    mnemonic: ex.mnemonic,
    imageUrl: ex.imageUrl,
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
