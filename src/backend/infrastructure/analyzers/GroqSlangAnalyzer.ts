import { getGroqClient } from "../groq";
import { SlangData } from "@/shared/types/expression";
import { BaseSlangAnalyzer } from "./BaseSlangAnalyzer";

export class GroqSlangAnalyzer extends BaseSlangAnalyzer {
  async analyzeSlang(text: string): Promise<SlangData> {
    const prompt = this.getBasePrompt(text);

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Return ONLY a valid JSON object. No markdown, no explanations." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.1-8b-instant",
      
      temperature: 0.2,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return this.enrichVariants(parsed);
  }
}
