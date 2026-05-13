import { IJournalAnalyzer } from "../../domain/interfaces/IJournalAnalyzer";
import { LinguisticAnalysis } from "@/shared/types/journal";

export class NvidiaJournalAnalyzer implements IJournalAnalyzer {
  async analyze(text: string, userLevel: string = "B1"): Promise<LinguisticAnalysis> {
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

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "You are a helpful English tutor. Return ONLY a valid JSON object." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      throw new Error(`Nvidia API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0]?.message?.content || "{}");
    
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
