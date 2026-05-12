import { ExpressionService } from "../services/ExpressionService";
import { JournalService } from "../services/JournalService";
import { PrismaExpressionRepository } from "./repositories/PrismaExpressionRepository";
import { PrismaJournalRepository } from "./repositories/PrismaJournalRepository";
import { GroqLinguisticAnalyzer } from "./analyzers/GroqLinguisticAnalyzer";
import { GroqJournalAnalyzer } from "./analyzers/GroqJournalAnalyzer";
import { GroqSlangAnalyzer } from "./analyzers/GroqSlangAnalyzer";
import { GeminiLinguisticAnalyzer } from "./analyzers/GeminiLinguisticAnalyzer";
import { GeminiSlangAnalyzer } from "./analyzers/GeminiSlangAnalyzer";
import { withFallback } from "./resilience";

// Singleton instances — primary providers
const expressionRepository = new PrismaExpressionRepository();
const journalRepository = new PrismaJournalRepository();
const journalAnalyzer = new GroqJournalAnalyzer();

// Resilient analyzers: Groq → Gemini on 429/503
const linguisticAnalyzer = withFallback(
  new GroqLinguisticAnalyzer(),
  new GeminiLinguisticAnalyzer()
);

const slangAnalyzer = withFallback(
  new GroqSlangAnalyzer(),
  new GeminiSlangAnalyzer()
);

export const expressionService = new ExpressionService(
  expressionRepository,
  linguisticAnalyzer,
  slangAnalyzer
);

export const journalService = new JournalService(
  journalRepository,
  journalAnalyzer
);

