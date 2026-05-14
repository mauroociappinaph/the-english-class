import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { IStreamable } from "../../domain/interfaces/IStreamable";
import { GroqExpressionResponse } from "../../domain/types";
import { parseRobustJson } from "../utils/json-parser";

const GET_PEDAGOGICAL_PROMPT = (text: string) => `You are a Senior English Professor and Linguistic Analyst (Cambridge standards). 
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
    "validExamples": ["He sets the table up", "He sets up the table"], // ALWAYS array of STRINGS, never objects
    "invalidExamples": ["He sets up it"], // ALWAYS array of STRINGS, never objects
    "collocations": [{ "phrase": "...", "frequency": "high|medium|low", "example": "...", "translation": "..." }]
  },
  "slangData": {
    "regionalVariants": [{ "region": "...", "country": "...", "flag": "...", "word": "...", "formality": "...", "slangLevel": 0, "culturalNote": "...", "usageContext": "...", "example": "...", "exampleTranslation": "...", "tags": ["..."] }],
    "detectedSlangLevel": 0,
    "isSlang": false,
    "similarWords": ["..."]
  }
}`;

export class NvidiaLinguisticAnalyzer implements ILinguisticAnalyzer, IStreamable {
  async *analyzeStream(text: string): AsyncGenerator<string, void, unknown> {
    const prompt = GET_PEDAGOGICAL_PROMPT(text);

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "Return ONLY a valid JSON object." },
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

  async analyzeExpression(text: string): Promise<GroqExpressionResponse> {
    const prompt = GET_PEDAGOGICAL_PROMPT(text);

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "Return ONLY a valid JSON object." },
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
    try {
      const result = parseRobustJson(content);
      console.log(`[NvidiaLinguisticAnalyzer] Analysis finished. Has chronology: ${!!result.chronology}`);
      return result;
    } catch (e) {
      console.error("[Nvidia] JSON parse error for content:", content);
      throw e;
    }
  }
}
