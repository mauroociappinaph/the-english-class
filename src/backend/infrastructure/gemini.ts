import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.warn("[Gemini] GOOGLE_GENERATIVE_AI_API_KEY not set — Gemini fallback will be unavailable.");
}

export const gemini = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const GEMINI_MODEL = "gemini-1.5-flash";
