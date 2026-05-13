import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

export const groq = new Groq({
  apiKey: apiKey || "",
  maxRetries: 0, // Fail fast on 429 to trigger fallback instantly
});

if (!apiKey && process.env.NODE_ENV === "production") {
  console.warn("⚠️ GROQ_API_KEY is missing in production environment!");
}
