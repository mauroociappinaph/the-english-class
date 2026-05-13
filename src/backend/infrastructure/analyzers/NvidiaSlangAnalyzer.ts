import { SlangData } from "@/shared/types/expression";
import { BaseSlangAnalyzer } from "./BaseSlangAnalyzer";

export class NvidiaSlangAnalyzer extends BaseSlangAnalyzer {
  async analyzeSlang(text: string): Promise<SlangData> {
    const prompt = this.getBasePrompt(text);

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "Return ONLY a valid JSON object. No markdown, no explanations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      })
    });

    if (!response.ok) {
      throw new Error(`Nvidia API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0]?.message?.content || "{}");
    return this.enrichVariants(parsed);
  }
}
