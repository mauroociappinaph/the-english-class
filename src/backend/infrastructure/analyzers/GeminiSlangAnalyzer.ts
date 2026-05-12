import { gemini, GEMINI_MODEL } from "../gemini";
import { ISlangAnalyzer } from "../../domain/interfaces/ISlangAnalyzer";
import { SlangData, RegionalVariant } from "@/shared/types/expression";

const SUPPORTED_VARIANTS = [
  { region: "American English", subregion: "General American", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "American English", subregion: "AAVE (African American Vernacular)", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "American English", subregion: "Southern English", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "American English", subregion: "New York English", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "British English", subregion: "RP (Received Pronunciation)", country: "United Kingdom", flag: "🇬🇧", audioLocale: "en-GB" },
  { region: "British English", subregion: "Cockney", country: "United Kingdom", flag: "🇬🇧", audioLocale: "en-GB" },
  { region: "Scottish English", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", audioLocale: "en-GB" },
  { region: "Irish English", country: "Ireland", flag: "🇮🇪", audioLocale: "en-IE" },
  { region: "Australian English", country: "Australia", flag: "🇦🇺", audioLocale: "en-AU" },
  { region: "New Zealand English", country: "New Zealand", flag: "🇳🇿", audioLocale: "en-NZ" },
  { region: "Canadian English", country: "Canada", flag: "🇨🇦", audioLocale: "en-CA" },
  { region: "South African English", country: "South Africa", flag: "🇿🇦", audioLocale: "en-ZA" },
  { region: "Indian English", country: "India", flag: "🇮🇳", audioLocale: "en-IN" },
  { region: "Nigerian English", country: "Nigeria", flag: "🇳🇬", audioLocale: "en-NG" },
  { region: "Jamaican English", country: "Jamaica", flag: "🇯🇲", audioLocale: "en-JM" },
];

export class GeminiSlangAnalyzer implements ISlangAnalyzer {
  async analyzeSlang(text: string): Promise<SlangData> {
    if (!gemini) {
      throw new Error("[GeminiSlangAnalyzer] Gemini client not initialized — GOOGLE_GENERATIVE_AI_API_KEY missing.");
    }

    const variantList = SUPPORTED_VARIANTS.map(
      (v) => `- ${v.region}${v.subregion ? ` / ${v.subregion}` : ""} (${v.country} ${v.flag})`
    ).join("\n");

    const prompt = `You are a senior sociolinguist and English dialect expert specializing in regional variation across global English varieties.

Analyze the word or expression "${text}" and return a valid JSON object describing how it varies across regional English dialects.

VARIANTS TO COVER (include ALL that have a meaningful equivalent or usage note):
${variantList}

RULES:
- "word": The equivalent word/expression in that regional variant.
- "culturalNote": Explain the cultural context behind this variant's usage. Write in English.
- "usageContext": When and where this variant is naturally used.
- "example": A real, natural sentence in English using this variant.
- "exampleTranslation": Spanish translation of the example sentence.
- "formality": one of: "formal" | "neutral" | "informal" | "slang" | "offensive" | "old-fashioned"
- "slangLevel": integer 0 (standard) to 3 (heavy slang)
- "tags": array from: ["slang", "formal", "offensive", "old-fashioned", "internet-slang", "regional", "colloquial", "vulgar"]

Return ONLY valid JSON:
{
  "regionalVariants": [
    {
      "region": "American English",
      "subregion": "General American",
      "country": "United States",
      "flag": "🇺🇸",
      "word": "${text}",
      "ipa": "/phonetic/",
      "formality": "neutral",
      "slangLevel": 0,
      "culturalNote": "...",
      "usageContext": "...",
      "example": "...",
      "exampleTranslation": "...",
      "tags": ["regional"],
      "audioLocale": "en-US"
    }
  ],
  "detectedSlangLevel": 0,
  "isSlang": false,
  "similarWords": ["word1", "word2", "word3"]
}`;

    const model = gemini.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const result = await model.generateContent([
      { text: "Return ONLY a valid JSON object. No markdown, no explanations." },
      { text: prompt },
    ]);

    const parsed = JSON.parse(result.response.text() || "{}") as SlangData;

    const enriched: RegionalVariant[] = (parsed.regionalVariants ?? []).map((v) => {
      const meta = SUPPORTED_VARIANTS.find(
        (s) => s.region === v.region && (!v.subregion || s.subregion?.startsWith(v.subregion.split(" ")[0]))
      );
      return {
        ...v,
        flag: v.flag || meta?.flag || "🌍",
        audioLocale: v.audioLocale || meta?.audioLocale || "en-US",
      };
    });

    return {
      regionalVariants: enriched,
      detectedSlangLevel: parsed.detectedSlangLevel ?? 0,
      isSlang: parsed.isSlang ?? false,
      similarWords: parsed.similarWords ?? [],
    };
  }
}
