import { ExpressionService } from "../src/backend/services/ExpressionService";
import { PrismaExpressionRepository } from "../src/backend/infrastructure/repositories/PrismaExpressionRepository";
import { GroqLinguisticAnalyzer } from "../src/backend/infrastructure/analyzers/GroqLinguisticAnalyzer";
import { NvidiaLinguisticAnalyzer } from "../src/backend/infrastructure/analyzers/NvidiaLinguisticAnalyzer";
import { withFallback } from "../src/backend/infrastructure/resilience";
import * as dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function runBenchmark() {
  console.log("🚀 Starting Performance Benchmark...");
  
  const repo = new PrismaExpressionRepository();
  const groq = new GroqLinguisticAnalyzer();
  const nvidia = new NvidiaLinguisticAnalyzer();
  
  const resilientAnalyzer = withFallback(groq, nvidia);
  const service = new ExpressionService(repo, resilientAnalyzer);

  const testWord = "performance_" + Math.random().toString(36).substring(7);
  
  console.log(`\n1. Testing AI Analysis for: "${testWord}"`);
  const startAnalysis = Date.now();
  
  try {
    const result = await service.analyzeExpression(testWord);
    const endAnalysis = Date.now();
    
    console.log(`✅ AI Analysis Time: ${(endAnalysis - startAnalysis) / 1000}s`);
    console.log(`   (Provider: ${process.env.GROQ_API_KEY ? 'Groq' : 'N/A'} -> ${process.env.NVIDIA_API_KEY ? 'Nvidia' : 'N/A'})`);
    
    if (result.linguistics.phrasalVerbDetails) {
       console.log("✅ Analysis Data structure: OK");
    }
    
    const startCache = Date.now();
    await service.analyzeExpression(testWord);
    const endCache = Date.now();
    console.log(`✅ Cached Retrieval: ${endCache - startCache}ms`);

  } catch (error) {
    console.error("❌ Benchmark failed:", error);
    if (error instanceof Error) {
       console.error("   Error Message:", error.message);
    }
  }

  console.log("\n2. DB Performance Check");
  const startDb = Date.now();
  const all = await repo.findAll();
  const endDb = Date.now();
  console.log(`✅ DB Fetch All (${all.length} records): ${endDb - startDb}ms`);

  process.exit(0);
}

runBenchmark();
