import { getGeminiClient, GEMINI_MODEL } from "../gemini";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { GroqExpressionResponse } from "../../domain/types";

export class GeminiLinguisticAnalyzer implements ILinguisticAnalyzer {
  async analyzeExpression(text: string): Promise<GroqExpressionResponse> {
    const client = getGeminiClient();
    if (!client) {
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
- "examples": Act as a Hollywood Script Analyst. Each example MUST have:
  - "text": English expression used in a sentence.
  - "translation": Standard Spanish translation.
  - "literalTranslation": Literal word-by-word Spanish translation.
  - "subtitleAdaptation": How a professional subtitler would adapt this for Netflix LATAM.
  - "category": Cinematic Tropes (e.g., "Medical Drama", "90s Sitcom", "Courtroom Thriller", "Sci-Fi", "Spy Movie", "Police Procedural").
  - "explanation": English explanation of context.
  - "tone": Delivery/emotion (e.g., "Sarcastic", "Desperate", "Commanding whisper").
  - "register": Level of formality (e.g., "Street Slang", "Highly Formal", "Casual").
  Provide at least 5 different cinematic examples.

- "tenses": identify the TOP 5 most natural, frequent, and relevant verbal forms/tenses for this specific expression in real-world usage. Each tense must have a "text" (ENGLISH example) and a "translation" (SPANISH).

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
    "tense_name_1": { "text": "...", "translation": "..." },
    "tense_name_2": { "text": "...", "translation": "..." },
    "tense_name_3": { "text": "...", "translation": "..." },
    "tense_name_4": { "text": "...", "translation": "..." },
    "tense_name_5": { "text": "...", "translation": "..." }
  },
  "examples": [
    { 
      "text": "English example", 
      "translation": "Spanish translation",
      "literalTranslation": "Word by word Spanish translation",
      "subtitleAdaptation": "Netflix subtitle adaptation",
      "category": "Medical Drama", 
      "explanation": "English explanation",
      "tone": "Sarcastic",
      "register": "Casual"
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

    const model = client.getGenerativeModel({
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
