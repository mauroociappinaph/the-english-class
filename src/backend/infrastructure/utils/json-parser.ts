/**
 * Utility to extract and parse JSON from LLM responses that might contain
 * markdown code blocks or other noise.
 */
export function parseRobustJson(text: string): any {
  if (!text) return {};

  let cleaned = text.trim();

  // Remove markdown code blocks if present (```json ... ``` or ``` ... ```)
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = cleaned.match(markdownRegex);
  
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("[JSON Parser] Failed to parse content:", cleaned);
    // If it still fails, try to find the first '{' and last '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const fallbackCleaned = cleaned.substring(firstBrace, lastBrace + 1);
        return JSON.parse(fallbackCleaned);
      } catch (innerError) {
        console.error("[JSON Parser] Fallback parsing also failed.");
        throw error;
      }
    }
    throw error;
  }
}
