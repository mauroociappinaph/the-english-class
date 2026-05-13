import { gemini, GEMINI_MODEL } from "../gemini";
import { IJournalAnalyzer } from "../../domain/interfaces/IJournalAnalyzer";
import { LinguisticAnalysis } from "@/shared/types/journal";

export class GeminiJournalAnalyzer implements IJournalAnalyzer {
  async analyze(text: string, userLevel: string = "B1"): Promise<LinguisticAnalysis> {
    if (!gemini) {
      throw new Error("[GeminiJournalAnalyzer] Gemini client not initialized.");
    }

    const prompt = `You are a Senior English Professor and Expert Linguistic Analyst. 
Analyze the provided journal entry for an English learner at level ${userLevel}.

Analyze the text and return a strictly valid JSON object. 
Ensure the "corrections" pinpoint EXACTLY the part of the text that needs changing.
Explanations should be in Spanish to help the student understand, but the "rule" should be in English.

Journal Entry:
"""
${text}
"""

Schema:
{
  "cefrLevel": "CEFR (A1-C2)",
  "metrics": {
    "grammar": 0 to 100,
    "vocabulary": 0 to 100,
    "coherence": 0 to 100
  },
  "corrections": [
    {
      "type": "GRAMMAR | VOCABULARY | SPELLING | PUNCTUATION | STYLE",
      "originalText": "exact text to replace",
      "suggestedText": "corrected version",
      "explanation": "pedagogical explanation in Spanish",
      "rule": "grammatical rule in English"
    }
  ],
  "recurringErrors": ["description of recurring patterns in Spanish"],
  "feedback": "Encouraging and constructive feedback in English",
  "suggestedVocab": ["3-5 more natural words or phrasal verbs for this context"]
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
    const parsed = JSON.parse(content || "{}");
    
    return {
      cefrLevel: parsed.cefrLevel || "B1",
      metrics: parsed.metrics || { grammar: 0, vocabulary: 0, coherence: 0 },
      corrections: parsed.corrections || [],
      recurringErrors: parsed.recurringErrors || [],
      feedback: parsed.feedback || "",
      suggestedVocab: parsed.suggestedVocab || []
    };
  }
}
