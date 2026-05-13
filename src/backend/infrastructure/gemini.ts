import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiClient() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return key ? new GoogleGenerativeAI(key) : null;
}

export const GEMINI_MODEL = "gemini-2.0-flash";
