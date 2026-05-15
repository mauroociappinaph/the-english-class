import { GroqExpressionResponse, AdaptivePathResponse } from "../../domain/types";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { IStreamable } from "../../domain/interfaces/IStreamable";

/**
 * BaseLinguisticAnalyzer: Common logic and prompts for all AI-based linguistic analyzers.
 */
export abstract class BaseLinguisticAnalyzer implements ILinguisticAnalyzer, IStreamable {
  
  abstract analyzeExpression(text: string): Promise<GroqExpressionResponse>;
  abstract analyzeExpressionBasic(text: string): Promise<Partial<GroqExpressionResponse>>;
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
  "type": "verb", // Pick only one: verb | phrasal_verb | idiom | expression | tense
  "cefr": "A1-C2", // CRITICAL: Provide an accurate Cambridge-based classification (A1, A2, B1, B2, C1, or C2). If unsure or the word is extremely rare/not standard, use "UNKNOWN". DO NOT default to B1.
  "ipa": "/phonetic transcription/",
  "correction": {
    "isCorrect": true, // false if the input has grammatical errors or is very unnatural
    "correctedText": "Fixed version if isCorrect is false",
    "explanation": "Why it was wrong or how to improve it in Spanish"
  },
  "frequency": 0.5, // 0.0 to 1.0
  "formality": "neutral", // Pick only one: formal | informal | neutral
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
    "noun": [{ 
      "word": "step", 
      "translation": "paso", 
      "pronunciation": "/step/",
      "cefr": "A1",
      "simpleExplanation": "A movement made by lifting your foot.",
      "grammarExplanation": "Countable noun. Often used with 'take'.",
      "patterns": ["step", "stepping", "stepped"],
      "morphology": { "prefix": null, "root": "step", "suffix": null },
      "synonyms": ["stride", "pace"],
      "antonyms": [],
      "commonMistakes": "Don't confuse with 'stairs'.",
      "naturalContexts": ["casual conversation", "academic"],
      "tips": ["Used in many idioms like 'step by step'."],
      "examples": [{"text": "He took a step forward.", "translation": "Él dio un paso adelante."}], 
      "commonCollocations": ["take a step", "next step", "giant step"] 
    }],
    "verb": [{ "word": "...", "...": "Add other parts of speech (verb, adjective, adverb) with the SAME structure as the noun example above" }]
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
  }
}
`;
  }

  /**
   * Generates a prompt for adaptive learning path recommendations.
   */
  protected getAdaptivePathPrompt(failedTexts: string[]): string {
    return `You are a Senior English Language Coach.
The student has struggled with the following expressions during a review session:
${failedTexts.map(t => `- ${t}`).join('\n')}

Based on these errors, design an "Adaptive Learning Path". 
Identify the common linguistic root, grammatical pattern, or contextual overlap causing confusion.
Suggest 3-5 NEW related expressions or grammatical structures they should study next to reinforce this specific area.

Return a strictly valid JSON object with:
{
  "diagnosis": "A concise pedagogical explanation of WHY they are struggling with these specific items in Spanish.",
  "recommendedExpressions": [
    {
      "text": "The new expression",
      "reason": "Why this specific recommendation helps fix the detected gap (in Spanish).",
      "level": "CEFR Level"
    }
  ],
  "learningTip": "A actionable tip to overcome this specific hurdle in Spanish."
}`;
  }

  /**
   * Generates a simplified prompt for "Basic Mode" when full analysis fails.
   */
  protected getBasicPedagogicalPrompt(text: string): string {
    return `You are a helpful English teacher. 
Provide a basic analysis of the expression: "${text}"

Return ONLY a valid JSON object with this schema:
{
  "translation": "Natural Spanish translation",
  "meaning": "Simple English explanation",
  "cefr": "CEFR Level (A1-C2)",
  "correction": {
    "isCorrect": true,
    "correctedText": null,
    "explanation": "Brief tip in Spanish if needed"
  },
  "type": "expression"
}`;
  }

  abstract suggestRelated(failedTexts: string[]): Promise<AdaptivePathResponse>;
}
