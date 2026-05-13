import { ISlangAnalyzer } from "../../domain/interfaces/ISlangAnalyzer";
import { SlangData, RegionalVariant } from "@/shared/types/expression";

const SUPPORTED_VARIANTS = [
  // American English
  { region: "American English", subregion: "General American", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "American English", subregion: "AAVE (African American Vernacular)", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "American English", subregion: "Southern English", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  { region: "American English", subregion: "New York English", country: "United States", flag: "🇺🇸", audioLocale: "en-US" },
  // British English
  { region: "British English", subregion: "RP (Received Pronunciation)", country: "United Kingdom", flag: "🇬🇧", audioLocale: "en-GB" },
  { region: "British English", subregion: "Cockney", country: "United Kingdom", flag: "🇬🇧", audioLocale: "en-GB" },
  { region: "British English", subregion: "Scouse", country: "United Kingdom", flag: "🇬🇧", audioLocale: "en-GB" },
  // Scottish
  { region: "Scottish English", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", audioLocale: "en-GB" },
  // Irish
  { region: "Irish English", country: "Ireland", flag: "🇮🇪", audioLocale: "en-IE" },
  // Australian
  { region: "Australian English", country: "Australia", flag: "🇦🇺", audioLocale: "en-AU" },
  // New Zealand
  { region: "New Zealand English", country: "New Zealand", flag: "🇳🇿", audioLocale: "en-NZ" },
  // Canadian
  { region: "Canadian English", country: "Canada", flag: "🇨🇦", audioLocale: "en-CA" },
  // South African
  { region: "South African English", country: "South Africa", flag: "🇿🇦", audioLocale: "en-ZA" },
  // Indian
  { region: "Indian English", country: "India", flag: "🇮🇳", audioLocale: "en-IN" },
  // Filipino
  { region: "Filipino English", country: "Philippines", flag: "🇵🇭", audioLocale: "en-PH" },
  // Singlish
  { region: "Singapore English (Singlish)", country: "Singapore", flag: "🇸🇬", audioLocale: "en-SG" },
  // Nigerian
  { region: "Nigerian English", country: "Nigeria", flag: "🇳🇬", audioLocale: "en-NG" },
  // Jamaican
  { region: "Jamaican English", country: "Jamaica", flag: "🇯🇲", audioLocale: "en-JM" },
];

export class NvidiaSlangAnalyzer implements ISlangAnalyzer {
  async analyzeSlang(text: string): Promise<SlangData> {
    const variantList = SUPPORTED_VARIANTS.map(
      (v) => `- ${v.region}${v.subregion ? ` / ${v.subregion}` : ""} (${v.country} ${v.flag})`
    ).join("\n");

    const prompt = `You are a senior sociolinguist and English dialect expert specializing in regional variation across global English varieties.

Analyze the word or expression "${text}" and return a valid JSON object describing how it varies across regional English dialects.

VARIANTS TO COVER (include ALL that have a meaningful equivalent or usage note):
${variantList}

RULES:
- "word": The equivalent word/expression in that regional variant. If the same word is used, repeat it.
- "culturalNote": Explain the cultural context behind this variant's usage. Write in English.
- "usageContext": When and where this variant is naturally used (e.g., "daily conversation", "formal writing", "social media").
- "example": A real, natural sentence in English using this variant.
- "exampleTranslation": Spanish translation of the example sentence.
- "formality": one of: "formal" | "neutral" | "informal" | "slang" | "offensive" | "old-fashioned"
- "slangLevel": integer 0 (standard) to 3 (heavy slang)
- "tags": array from: ["slang", "formal", "offensive", "old-fashioned", "internet-slang", "regional", "colloquial", "vulgar"]
- "detectedSlangLevel": overall slang level of the original word (0-3)
- "isSlang": true if the word is primarily slang
- "similarWords": 3-5 related words or synonyms in General American English

Only include variants where there is a meaningful equivalent, pronunciation difference, or cultural note worth sharing. 
Skip variants where the word is completely unused and there is nothing to say.

Return ONLY valid JSON in this exact schema:
{
  "regionalVariants": [
    {
      "region": "American English",
      "subregion": "General American",
      "country": "United States",
      "flag": "🇺🇸",
      "word": "apartment",
      "pronunciation": "uh-PART-ment",
      "ipa": "/əˈpɑːrtmənt/",
      "formality": "neutral",
      "slangLevel": 0,
      "culturalNote": "Standard term used across the US for a rented residential unit.",
      "usageContext": "Everyday conversation, real estate listings, formal documents.",
      "example": "I'm looking for a two-bedroom apartment near downtown.",
      "exampleTranslation": "Estoy buscando un apartamento de dos habitaciones cerca del centro.",
      "tags": ["regional"],
      "audioLocale": "en-US"
    }
  ],
  "detectedSlangLevel": 0,
  "isSlang": false,
  "similarWords": ["flat", "unit", "studio", "condo"]
}`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
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
    const parsed = JSON.parse(data.choices[0]?.message?.content || "{}") as SlangData;

    // Merge static metadata (flags, audioLocale) into parsed variants
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
