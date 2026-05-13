import { groq } from "../groq";
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
  Provide exactly 3 different cinematic examples.
- "slangData": If the expression is used identically across different regions (e.g. standard English), provide ONLY the primary regional variant. Only list multiple variants if there are significant linguistic, phonetic, or cultural differences.

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
      "present_perfect_passive": { "text": "...", "translation": "..." },
      "past_perfect_passive": { "text": "...", "translation": "..." },
      "future_perfect_passive": { "text": "...", "translation": "..." },
      "conditional_0": { "text": "...", "translation": "..." },
      "conditional_1": { "text": "...", "translation": "..." },
      "conditional_2": { "text": "...", "translation": "..." },
      "conditional_3": { "text": "...", "translation": "..." },
      "conditional_mixed": { "text": "...", "translation": "..." },
      "modal_can": { "text": "...", "translation": "..." },
      "modal_could": { "text": "...", "translation": "..." },
      "modal_should": { "text": "...", "translation": "..." },
      "modal_must": { "text": "...", "translation": "..." },
      "modal_might": { "text": "...", "translation": "..." },
      "modal_may": { "text": "...", "translation": "..." },
      "modal_would": { "text": "...", "translation": "..." },
      "gerund_form": { "text": "...", "translation": "..." },
      "infinitive_form": { "text": "...", "translation": "..." },
      "imperative": { "text": "...", "translation": "..." },
      "question_form": { "text": "...", "translation": "..." },
      "negative_form": { "text": "...", "translation": "..." },
      "relative_clause": { "text": "...", "translation": "..." },
      "phrasal_structure": { "text": "...", "translation": "..." },
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
    "detectedSlangLevel": 0,
    "isSlang": false,
    "similarWords": ["word1", "word2"]
  }
}`;

    const stream = await groq.chat.completions.create({
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
  Provide exactly 3 different cinematic examples.
- "slangData": If the expression is used identically across different regions (e.g. standard English), provide ONLY the primary regional variant. Only list multiple variants if there are significant linguistic, phonetic, or cultural differences.

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
      "present_perfect_passive": { "text": "...", "translation": "..." },
      "past_perfect_passive": { "text": "...", "translation": "..." },
      "future_perfect_passive": { "text": "...", "translation": "..." },
      "conditional_0": { "text": "...", "translation": "..." },
      "conditional_1": { "text": "...", "translation": "..." },
      "conditional_2": { "text": "...", "translation": "..." },
      "conditional_3": { "text": "...", "translation": "..." },
      "conditional_mixed": { "text": "...", "translation": "..." },
      "modal_can": { "text": "...", "translation": "..." },
      "modal_could": { "text": "...", "translation": "..." },
      "modal_should": { "text": "...", "translation": "..." },
      "modal_must": { "text": "...", "translation": "..." },
      "modal_might": { "text": "...", "translation": "..." },
      "modal_may": { "text": "...", "translation": "..." },
      "modal_would": { "text": "...", "translation": "..." },
      "gerund_form": { "text": "...", "translation": "..." },
      "infinitive_form": { "text": "...", "translation": "..." },
      "imperative": { "text": "...", "translation": "..." },
      "question_form": { "text": "...", "translation": "..." },
      "negative_form": { "text": "...", "translation": "..." },
      "relative_clause": { "text": "...", "translation": "..." },
      "phrasal_structure": { "text": "...", "translation": "..." },
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
    "detectedSlangLevel": 0,
    "isSlang": false,
    "similarWords": ["word1", "word2"]
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
