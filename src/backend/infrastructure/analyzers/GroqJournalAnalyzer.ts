import { getGroqClient } from "../groq";
import { IJournalAnalyzer } from "../../domain/interfaces/IJournalAnalyzer";
import { IStreamable } from "../../domain/interfaces/IStreamable";
import { LinguisticAnalysis } from "@/shared/types/journal";

export class GroqJournalAnalyzer implements IJournalAnalyzer, IStreamable {
  async *analyzeStream(text: string, userLevel: string = "B1"): AsyncGenerator<string, void, unknown> {
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

    const client = getGroqClient();
    const stream = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful English tutor. Return ONLY a valid JSON object." },
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

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful English tutor. Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || "{}");
    
    return {
      cefrLevel: response.cefrLevel || "B1",
      metrics: response.metrics || { grammar: 0, vocabulary: 0, coherence: 0 },
      corrections: response.corrections || [],
      recurringErrors: response.recurringErrors || [],
      feedback: response.feedback || "",
      suggestedVocab: response.suggestedVocab || []
    };
  }
}
