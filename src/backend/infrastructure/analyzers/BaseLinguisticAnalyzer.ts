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
    return `You are a Master Linguist, English Professor, and Vocabulary Acquisition Expert (Cambridge/Oxford standards). 
Analyze the provided English expression with extreme depth. Focus on accelerating vocabulary retention through morphology and logical connections.

Return a strictly valid JSON object.

RULES:
- "translation": Natural Spanish translation.
- "meaning": Comprehensive explanation in ENGLISH.
- "cefr": MUST be exactly one of: "A1", "A2", "B1", "B2", "C1", "C2". 
  Be extremely precise using Cambridge/Oxford vocabulary levels guidelines:
  - "A1" (Beginner): Extremely simple, everyday words (e.g. cat, hello, walk).
  - "A2" (Elementary): Simple verbs, adjectives, basic daily objects (e.g. airport, expensive, decide).
  - "B1" (Intermediate): Intermediate vocabulary, simple idioms, common phrasal verbs (e.g. absolute, depend on, keep up).
  - "B2" (Upper-Intermediate): Sophisticated vocabulary, business concepts, idiomatic phrasal verbs (e.g. accomplish, point out, break down).
  - "C1" (Advanced): High-level academic/literary terms, rare phrasal verbs, complex idioms (e.g. ubiquitous, meticulous, grass on).
  - "C2" (Proficiency): Obscure, highly literary, archaic, or native-level expressions (e.g. serendipity, ephemeral, chock-a-block).
- "chronology": MUST include this field with retrospective, active, and projection modules.
- "secondaryMeanings": Provide all significant polysemic variations in ENGLISH.
- "usageTips": Naturalness, Common Mistakes, and Context in ENGLISH.
- "tenses": TOP 5 natural verbal forms.
- "examples": 3 cinematic examples with "register" (e.g., informal, academic) and "tone".
- "mnemonic": A vivid, highly pedagogical memory trick or word association in Spanish to help the student remember the phrase. For example, linking the pronunciation to a Spanish sound or using a funny association. Avoid generic placeholders.
- "wordFamilies": This is the most important part. For each Part of Speech (noun, verb, adjective, adverb):
    - Provide at least 2 variants if they exist.
    - MUST include: "word", "translation", "pronunciation", "cefr", "simpleExplanation", "grammarExplanation", "synonyms", "antonyms", "commonCollocations", "commonExpressions", "naturalContexts", "morphology" (prefix, root, suffix).
    - "naturalContexts" MUST be an array of: "formal", "informal", "spoken", "business", "academic", "literary", "slang", "casual conversation".

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
  "type": "verb", // verb | phrasal_verb | idiom | expression | tense
  "cefr": "A1 | A2 | B1 | B2 | C1 | C2", // Must be exactly one of: A1 | A2 | B1 | B2 | C1 | C2. Evaluate accurately.
  "ipa": "/phonetic transcription/",
  "correction": { "isCorrect": true, "correctedText": null, "explanation": "..." },
  "frequency": 0.5, // 0.0 to 1.0 (Natural usage frequency)
  "formality": "neutral", // formal | informal | neutral
  "mnemonic": "un truco de memoria o regla mnemotécnica en español",
  "usageTips": { "naturalness": "...", "commonMistake": "...", "context": "..." },
  "tenses": { "tense_name": { "text": "...", "translation": "..." } },
  "examples": [
    { 
      "text": "...", "translation": "...", "literalTranslation": "...", "subtitleAdaptation": "...", 
      "category": "Genre", "explanation": "...", "tone": "...", "register": "..." 
    }
  ],
  "wordFamilies": {
    "noun": [{ 
      "word": "...", "translation": "...", "pronunciation": "...", "cefr": "...",
      "simpleExplanation": "...", "grammarExplanation": "...",
      "patterns": ["..."],
      "morphology": { "prefix": "...", "root": "...", "suffix": "..." },
      "synonyms": ["..."], "antonyms": ["..."],
      "commonMistakes": "...",
      "naturalContexts": ["..."],
      "commonCollocations": ["..."],
      "commonExpressions": ["..."],
      "tips": ["..."]
    }],
    "verb": [], "adjective": [], "adverb": []
  },
  "phrasalVerbDetails": { 
    "verb": "...", "particle": "...", "separable": "...", "transitive": true,
    "logicExplanation": "...", "transitiveExplanation": "...", "separabilityExplanation": "...",
    "validExamples": ["..."], "invalidExamples": ["..."],
    "collocations": [{ "phrase": "...", "frequency": "...", "example": "...", "translation": "..." }]
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

RULES:
- "cefr": MUST be exactly one of: "A1", "A2", "B1", "B2", "C1", "C2". 
  Be extremely precise using Cambridge/Oxford vocabulary levels guidelines:
  - "A1" (Beginner): Extremely simple, everyday words (e.g. cat, hello, walk).
  - "A2" (Elementary): Simple verbs, adjectives, basic daily objects (e.g. airport, expensive, decide).
  - "B1" (Intermediate): Intermediate vocabulary, simple idioms, common phrasal verbs (e.g. absolute, depend on, keep up).
  - "B2" (Upper-Intermediate): Sophisticated vocabulary, business concepts, idiomatic phrasal verbs (e.g. accomplish, point out, break down).
  - "C1" (Advanced): High-level academic/literary terms, rare phrasal verbs, complex idioms (e.g. ubiquitous, meticulous, grass on).
  - "C2" (Proficiency): Obscure, highly literary, archaic, or native-level expressions (e.g. serendipity, ephemeral, chock-a-block).
- "mnemonic": A vivid, highly pedagogical memory trick or word association in Spanish to help the student remember the phrase. Avoid generic placeholders.

Return ONLY a valid JSON object with this schema:
{
  "translation": "Natural Spanish translation",
  "meaning": "Simple English explanation",
  "cefr": "B2", // Must be exactly one of: A1 | A2 | B1 | B2 | C1 | C2
  "mnemonic": "un truco de memoria o regla mnemotécnica en español",
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
