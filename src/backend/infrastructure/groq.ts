import Groq from "groq-sdk";

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  return new Groq({
    apiKey: apiKey || "",
    maxRetries: 0, // Fail fast on 429 to trigger fallback instantly
  });
}
