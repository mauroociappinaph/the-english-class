import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { GroqExpressionResponse, AdaptivePathResponse } from "../../domain/types";
import { parseRobustJson } from "../utils/json-parser";
import { BaseLinguisticAnalyzer } from "./BaseLinguisticAnalyzer";

export class NvidiaLinguisticAnalyzer extends BaseLinguisticAnalyzer {
  async *analyzeStream(text: string): AsyncGenerator<string, void, unknown> {
    const prompt = this.getPedagogicalPrompt(text);

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
    const prompt = this.getPedagogicalPrompt(text);

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
      const result = parseRobustJson(content) as unknown as GroqExpressionResponse;
      console.log(`[NvidiaLinguisticAnalyzer] Analysis finished. Has chronology: ${!!result.chronology}`);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async suggestRelated(failedTexts: string[]): Promise<AdaptivePathResponse> {
    const prompt = this.getAdaptivePathPrompt(failedTexts);

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
    return parseRobustJson(content) as unknown as AdaptivePathResponse;
  }
}
