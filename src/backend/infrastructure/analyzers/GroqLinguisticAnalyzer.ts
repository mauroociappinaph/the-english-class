import { groq } from "../groq";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { GroqExpressionResponse } from "../../domain/types";

export class GroqLinguisticAnalyzer implements ILinguisticAnalyzer {
  async analyzeExpression(text: string): Promise<GroqExpressionResponse> {
    const prompt = `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.

RULES:
- "translation": Provide a natural Spanish translation of the expression.
- "meaning": Provide a clear explanation in ENGLISH.
- "secondaryMeanings": Provide other meanings in ENGLISH.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": Each tense must have a "text" (ENGLISH example) and a "translation" (SPANISH).
- "examples": Each example must have a "text" (ENGLISH), "translation" (SPANISH), and "explanation" (ENGLISH).

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
      "future_continuous": { "text": "...", "translation": "..." },
      "present_perfect": { "text": "...", "translation": "..." },
      "past_perfect": { "text": "...", "translation": "..." },
      "future_perfect": { "text": "...", "translation": "..." },
      "present_perfect_continuous": { "text": "...", "translation": "..." },
      "past_perfect_continuous": { "text": "...", "translation": "..." },
      "future_perfect_continuous": { "text": "...", "translation": "..." },
      "present_passive": { "text": "...", "translation": "..." },
      "past_passive": { "text": "...", "translation": "..." },
      "future_passive": { "text": "...", "translation": "..." },
      "conditional_0": { "text": "...", "translation": "..." },
      "conditional_1": { "text": "...", "translation": "..." },
      "conditional_2": { "text": "...", "translation": "..." },
      "conditional_3": { "text": "...", "translation": "..." },
      "conditional_mixed": { "text": "...", "translation": "..." },
      "modal_structures": { "text": "...", "translation": "..." },
      "gerunds_infinitives": { "text": "...", "translation": "..." },
      "used_to": { "text": "...", "translation": "..." },
      "would_past_habits": { "text": "...", "translation": "..." },
      "reported_speech": { "text": "...", "translation": "..." },
      "subjunctive": { "text": "...", "translation": "..." },
      "imperative": { "text": "...", "translation": "..." }
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

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  }
}
