/**
 * Utility to clean and repair LLM output for safer JSON parsing.
 */
export class LinguisticSanitizer {
  /**
   * Attempts to extract and repair a JSON object from a string.
   */
  static safeJsonParse<T>(raw: string): T {
    let clean = raw.trim();

    // 1. Remove Markdown code blocks if present
    if (clean.includes("```")) {
      const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        clean = match[1].trim();
      }
    }

    // 2. Find first '{' and last '}' to strip any preamble or postamble
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      clean = clean.slice(firstBrace, lastBrace + 1);
    }

    try {
      return JSON.parse(clean) as T;
    } catch (error) {
      console.warn("[LinguisticSanitizer] Primary JSON parse failed. Attempting basic repair...");
      
      // 3. Very basic repair: Try to add missing closing braces/brackets if it was truncated
      // This is a last-resort heuristic.
      try {
        const repaired = this.attemptRepair(clean);
        return JSON.parse(repaired) as T;
      } catch (innerError) {
        console.error("[LinguisticSanitizer] All parse attempts failed for:", clean.slice(0, 100) + "...");
        throw new Error("MALFORMED_JSON");
      }
    }
  }

  private static attemptRepair(json: string): string {
    let repaired = json;
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;

    // Add missing closures
    if (openBrackets > closeBrackets) {
      repaired += "]".repeat(openBrackets - closeBrackets);
    }
    if (openBraces > closeBraces) {
      repaired += "}".repeat(openBraces - closeBraces);
    }

    return repaired;
  }
}
