import { GroqExpressionResponse } from "../../domain/types";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { IStreamable } from "../../domain/interfaces/IStreamable";

/**
 * BaseLinguisticAnalyzer: Common logic and prompts for all AI-based linguistic analyzers.
 */
export abstract class BaseLinguisticAnalyzer implements ILinguisticAnalyzer, IStreamable {
  
  abstract analyzeExpression(text: string): Promise<GroqExpressionResponse>;
  abstract analyzeStream(text: string, context?: unknown): AsyncGenerator<string, void, unknown>;

  /**
   * Generates the standard pedagogical prompt for English linguistic analysis.
   */
  protected getPedagogicalPrompt(text: string): string {
    return `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
Analyze the provided English expression and return a strictly valid JSON object.

RULES:
- "translation": Provide a natural Spanish translation of the expression.
- "meaning": Provide a clear explanation in ENGLISH.
- "chronology": MUST include this field with retrospective, active, and projection modules. This is CRITICAL for the Visual Grammar Engine.
- "secondaryMeanings": Scan for polysemy. Provide all other significantly different definitions or usages in different domains in ENGLISH.
- "usageTips": All descriptions must be in ENGLISH.
- "tenses": identify the TOP 5 most natural verbal forms/tenses. Each must have "text" (ENGLISH) and "translation" (SPANISH).
- Provide exactly 3 different cinematic examples in "examples".

Expression: "${text}"

Schema:
{
  "translation": "Spanish translation",
  "meaning": "English explanation",
  "chronology": {
    "retrospective": {
      "pastSimple": { "tense": "...", "example": "...", "simpleExplanation": "...", "technicalExplanation": "...", "visualTimelinePoint": 20, "grammarTags": ["..."], "visualIndicators": ["..."] },
      "pastPerfect": { "tense": "...", "example": "...", "simpleExplanation": "...", "technicalExplanation": "...", "visualTimelinePoint": 10, "grammarTags": ["..."], "visualIndicators": ["..."] }
    },
    "active": {
      "presentSimple": { "tense": "...", "example": "...", "simpleExplanation": "...", "technicalExplanation": "...", "visualTimelinePoint": 50, "grammarTags": ["..."], "visualIndicators": ["..."] },
      "presentPerfect": { "tense": "...", "example": "...", "simpleExplanation": "...", "technicalExplanation": "...", "visualTimelinePoint": 40, "grammarTags": ["..."], "visualIndicators": ["..."] }
    },
    "projection": {
      "futureSimple": { "tense": "...", "example": "...", "simpleExplanation": "...", "technicalExplanation": "...", "visualTimelinePoint": 80, "grammarTags": ["..."], "visualIndicators": ["..."] }
    }
  },
  "secondaryMeanings": ["English secondary meaning"],
  "type": "verb | phrasal_verb | idiom | expression | tense",
  "cefr": "A1 | A2 | B1 | B2 | C1 | C2",
  "ipa": "/phonetic transcription/",
  "frequency": 0.0 to 1.0,
  "formality": "formal | informal | neutral",
  "mnemonic": "memory trick in English",
  "imagePrompt": "artistic prompt for image generator",
  "usageTips": {
    "naturalness": "English description",
    "commonMistake": "English description",
    "context": "English description"
  },
  "tenses": {
    "tense_name": { "text": "...", "translation": "..." }
  },
  "examples": [
    { 
      "text": "English example", 
      "translation": "Spanish translation",
      "literalTranslation": "Word by word",
      "subtitleAdaptation": "Netflix style",
      "category": "Genre", 
      "explanation": "English explanation",
      "tone": "Tone",
      "register": "Register"
    }
  ],
  "wordFamilies": {
    "noun": [{ "word": "...", "translation": "...", "simpleExplanation": "...", "examples": [{"text": "...", "translation": "..."}], "commonCollocations": ["string", "string"] }],
    "verb": [{ "word": "...", "translation": "...", "simpleExplanation": "...", "examples": [{"text": "...", "translation": "..."}], "commonCollocations": ["string", "string"] }],
    "adjective": [{ "word": "...", "translation": "...", "simpleExplanation": "...", "examples": [{"text": "...", "translation": "..."}], "commonCollocations": ["string", "string"] }],
    "adverb": [{ "word": "...", "translation": "...", "simpleExplanation": "...", "examples": [{"text": "...", "translation": "..."}], "commonCollocations": ["string", "string"] }]
  },
  "phrasalVerbDetails": {
    "verb": "base verb",
    "particle": "preposition/adverb",
    "separable": "no | optional | mandatory",
    "transitive": true,
    "logicExplanation": "...",
    "transitiveExplanation": "...",
    "separabilityExplanation": "...",
    "validExamples": ["He sets the table up", "He sets up the table"],
    "invalidExamples": ["He sets up it"],
    "collocations": [{ "phrase": "...", "frequency": "high|medium|low", "example": "...", "translation": "..." }]
  },
  "slangData": {
    "regionalVariants": [{ "region": "...", "country": "...", "flag": "...", "word": "...", "formality": "...", "slangLevel": 0, "culturalNote": "...", "usageContext": "...", "example": "...", "exampleTranslation": "...", "tags": ["..."] }],
    "detectedSlangLevel": 0,
    "isSlang": false,
    "similarWords": ["..."]
  }
}`;
  }
}
