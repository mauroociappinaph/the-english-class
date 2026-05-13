import { getGroqClient } from "../groq";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { IStreamable } from "../../domain/interfaces/IStreamable";
import { GroqExpressionResponse } from "../../domain/types";

export class GroqLinguisticAnalyzer implements ILinguisticAnalyzer, IStreamable {
  async *analyzeStream(text: string): AsyncGenerator<string, void, unknown> {
    const prompt = `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.

RULES:
- "translation": Provide a natural Spanish translation of the expression.
- "meaning": Provide a clear explanation in ENGLISH.
- "secondaryMeanings": Scan for polysemy. Provide all other significantly different definitions or usages in different domains (e.g., technical, social, scientific, slang) in ENGLISH. Do not include minor nuances, only distinct alternative meanings.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": DO NOT provide a fixed list. Instead, identify the TOP 5 most natural, frequent, and relevant verbal forms/tenses for this specific expression in real-world usage.
  Each tense must have a "text" (ENGLISH example) and a "translation" (SPANISH).
  Provide exactly 3 different cinematic examples in the "examples" section.

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
    "noun": [
      {
        "word": "string",
        "pronunciation": "string",
        "cefr": "A1-C2",
        "translation": "string",
        "simpleExplanation": "string",
        "differenceWithSimilar": "string",
        "examples": [{ "text": "...", "translation": "..." }],
        "grammarExplanation": "string",
        "commonCollocations": ["string"],
        "synonyms": ["string"],
        "antonyms": ["string"],
        "commonMistakes": "string",
        "naturalContexts": ["formal", "informal", "business", "academic", "casual conversation"],
        "patterns": ["pattern1", "pattern2"],
        "morphology": { "prefix": "...", "suffix": "...", "root": "..." },
        "tips": ["string"]
      }
    ],
    "verb": ["...same as noun structure..."],
    "adjective": ["...same as noun structure..."],
    "adverb": ["...same as noun structure..."]
  },
  "phrasalVerbDetails": {
    "verb": "base verb",
    "particle": "preposition/adverb",
    "separable": "no | optional | mandatory",
    "transitive": true,
    "commonCollocations": ["word1", "word2"]
  },
  "slangData": {
    "regionalVariants": [
      {
        "region": "string (e.g. American English)",
        "country": "string (e.g. United States)",
        "flag": "emoji flag",
        "word": "string (the expression itself or regional equivalent)",
        "formality": "formal | neutral | informal | slang",
        "slangLevel": 0,
        "culturalNote": "brief explanation of origin/usage in English",
        "usageContext": "where it is most common",
        "example": "English example",
        "exampleTranslation": "Spanish translation",
        "tags": ["regional"]
      }
    ],
    "_instruction": "If variants are identical across regions, provide ONLY the primary regional variant in regionalVariants[]. Only list multiple if they differ significantly.",
    "detectedSlangLevel": 0,
    "isSlang": false,
    "similarWords": ["word1", "word2"]
  }
} `;

    const client = getGroqClient();
    const stream = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  }

  async analyzeExpression(text: string): Promise<GroqExpressionResponse> {
    const prompt = `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.

RULES:
- "translation": Provide a natural Spanish translation of the expression.
- "meaning": Provide a clear explanation in ENGLISH.
- "secondaryMeanings": Scan for polysemy. Provide all other significantly different definitions or usages in different domains (e.g., technical, social, scientific, slang) in ENGLISH. Do not include minor nuances, only distinct alternative meanings.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": DO NOT provide a fixed list. Instead, identify the TOP 5 most natural, frequent, and relevant verbal forms/tenses for this specific expression in real-world usage.
  Each tense must have a "text" (ENGLISH example) and a "translation" (SPANISH).
  Provide exactly 3 different cinematic examples in the "examples" section.

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
    "noun": [
      {
        "word": "string",
        "pronunciation": "string",
        "cefr": "A1-C2",
        "translation": "string",
        "simpleExplanation": "string",
        "differenceWithSimilar": "string",
        "examples": [{ "text": "...", "translation": "..." }],
        "grammarExplanation": "string",
        "commonCollocations": ["string"],
        "synonyms": ["string"],
        "antonyms": ["string"],
        "commonMistakes": "string",
        "naturalContexts": ["formal", "informal", "business", "academic", "casual conversation"],
        "patterns": ["pattern1", "pattern2"],
        "morphology": { "prefix": "...", "suffix": "...", "root": "..." },
        "tips": ["string"]
      }
    ],
    "verb": ["...same as noun structure..."],
    "adjective": ["...same as noun structure..."],
    "adverb": ["...same as noun structure..."]
  },
  "phrasalVerbDetails": {
    "verb": "base verb",
    "particle": "preposition/adverb",
    "separable": "no | optional | mandatory",
    "transitive": true,
    "commonCollocations": ["word1", "word2"]
  },
  "slangData": {
    "regionalVariants": [
      {
        "region": "string (e.g. American English)",
        "country": "string (e.g. United States)",
        "flag": "emoji flag",
        "word": "string (the expression itself or regional equivalent)",
        "formality": "formal | neutral | informal | slang",
        "slangLevel": 0,
        "culturalNote": "brief explanation of origin/usage in English",
        "usageContext": "where it is most common",
        "example": "English example",
        "exampleTranslation": "Spanish translation",
        "tags": ["regional"]
      }
    ],
    "_instruction": "If variants are identical across regions, provide ONLY the primary regional variant in regionalVariants[]. Only list multiple if they differ significantly.",
    "detectedSlangLevel": 0,
    "isSlang": false,
    "similarWords": ["word1", "word2"]
  }
} `;

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
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
