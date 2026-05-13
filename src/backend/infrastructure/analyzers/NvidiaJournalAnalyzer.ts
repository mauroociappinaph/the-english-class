import { IJournalAnalyzer } from "../../domain/interfaces/IJournalAnalyzer";
import { IStreamable } from "../../domain/interfaces/IStreamable";
import { LinguisticAnalysis } from "@/shared/types/journal";
import { parseRobustJson } from "../utils/json-parser";

export class NvidiaJournalAnalyzer implements IJournalAnalyzer, IStreamable {
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
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Nvidia API error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            // ignore partial JSON parse errors
          }
        }
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
    const content = data.choices[0]?.message?.content || "{}";
    const parsed = parseRobustJson(content);
    
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
