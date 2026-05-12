import { gemini, GEMINI_MODEL } from "../gemini";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { GroqExpressionResponse } from "../../domain/types";

export class GeminiLinguisticAnalyzer implements ILinguisticAnalyzer {
  async analyzeExpression(text: string): Promise<GroqExpressionResponse> {
    if (!gemini) {
      throw new Error("[GeminiLinguisticAnalyzer] Gemini client not initialized — GOOGLE_GENERATIVE_AI_API_KEY missing.");
    }

    const prompt = `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.

RULES:
- "translation": Provide a natural Spanish translation of the expression.
- "meaning": Provide a clear explanation in ENGLISH.
- "secondaryMeanings": Provide other meanings in ENGLISH.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": Each tense must have a "text" (ENGLISH example) and a "translation" (SPANISH).
- "examples": Each example must have a "text" (ENGLISH), "translation" (SPANISH), and "explanation" (ENGLISH). Provide at least 5 different examples, covering various contexts (e.g. cotidiano, profesional, académico, emprendimiento, ciencia ficción, policial, política, espías, dialectal, etc.).

Expression: "${text}"

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
    "present_simple": { "text": "...", "translation": "..." },
    "past_simple": { "text": "...", "translation": "..." },
    "future_simple": { "text": "...", "translation": "..." },
    "present_continuous": { "text": "...", "translation": "..." },
    "past_continuous": { "text": "...", "translation": "..." },
    "present_perfect": { "text": "...", "translation": "..." },
    "past_perfect": { "text": "...", "translation": "..." },
    "conditional_1": { "text": "...", "translation": "..." },
    "conditional_2": { "text": "...", "translation": "..." },
    "conditional_3": { "text": "...", "translation": "..." },
    "reported_speech": { "text": "...", "translation": "..." },
    "subjunctive": { "text": "...", "translation": "..." }
  },
  "examples": [
    { 
      "text": "English example", 
      "translation": "Spanish translation",
      "category": "cotidiano", 
      "explanation": "English explanation" 
    }
  ],
  "wordFamilies": {
    "noun": ["related noun"],
    "verb": ["related verb"],
    "adjective": ["related adjective"],
    "adverb": ["related adverb"]
  },
  "phrasalVerbDetails": {
    "verb": "base verb",
    "particle": "preposition/adverb",
    "separable": "no | optional | mandatory",
    "transitive": true,
    "commonCollocations": ["word1", "word2"]
  }
}`;

    const model = gemini.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const result = await model.generateContent([
      { text: "Return ONLY a valid JSON object. No markdown, no explanations." },
      { text: prompt },
    ]);

    const content = result.response.text();
    return JSON.parse(content || "{}") as GroqExpressionResponse;
  }
}
