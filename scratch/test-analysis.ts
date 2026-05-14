
import { linguisticAnalyzer } from "./src/backend/infrastructure/registry";
import * as dotenv from "dotenv";
dotenv.config();

async function test() {
  const text = "worry";
  console.log(`Starting test for: "${text}"`);
  try {
    const result = await linguisticAnalyzer.analyzeExpression(text);
    console.log("Result received:");
    console.log(JSON.stringify(result, null, 2));
    console.log("Has chronology:", !!result.chronology);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
