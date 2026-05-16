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
- "chronology": MUST include this field with retrospective, active, and projection modules.
- "secondaryMeanings": Provide all significant polysemic variations in ENGLISH.
- "usageTips": Naturalness, Common Mistakes, and Context in ENGLISH.
- "tenses": TOP 5 natural verbal forms.
- "examples": 3 cinematic examples with "register" (e.g., informal, academic) and "tone".
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
  "cefr": "A1-C2", 
  "ipa": "/phonetic transcription/",
  "correction": { "isCorrect": true, "correctedText": null, "explanation": "..." },
  "frequency": 0.5, // 0.0 to 1.0 (Natural usage frequency)
  "formality": "neutral", // formal | informal | neutral
  "mnemonic": "memory trick",
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
