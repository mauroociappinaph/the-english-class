import { getGroqClient } from "../groq";
import { ILinguisticAnalyzer } from "../../domain/interfaces/ILinguisticAnalyzer";
import { GroqExpressionResponse, AdaptivePathResponse } from "../../domain/types";
import { BaseLinguisticAnalyzer } from "./BaseLinguisticAnalyzer";

export class GroqLinguisticAnalyzer extends BaseLinguisticAnalyzer {
  async *analyzeStream(text: string): AsyncGenerator<string, void, unknown> {
    const prompt = this.getPedagogicalPrompt(text);

    const client = getGroqClient();
    const stream = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        process.stdout.write("."); // Just a dot per chunk
        yield content;
      }
    }
    console.log("\n[GroqLinguisticAnalyzer] Stream yielded all chunks");
  }

  async analyzeExpression(text: string): Promise<GroqExpressionResponse> {
    const prompt = this.getPedagogicalPrompt(text);

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    console.log(`[GroqLinguisticAnalyzer] Analysis finished. Has chronology: ${!!result.chronology}`);
    return result;
  }

  async suggestRelated(failedTexts: string[]): Promise<AdaptivePathResponse> {
    const prompt = this.getAdaptivePathPrompt(failedTexts);

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}") as AdaptivePathResponse;
  }
}
