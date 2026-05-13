import { ExpressionService } from "../services/ExpressionService";
import { JournalService } from "../services/JournalService";
import { PrismaExpressionRepository } from "./repositories/PrismaExpressionRepository";
import { PrismaJournalRepository } from "./repositories/PrismaJournalRepository";
import { GroqLinguisticAnalyzer } from "./analyzers/GroqLinguisticAnalyzer";
import { GroqJournalAnalyzer } from "./analyzers/GroqJournalAnalyzer";
import { GroqSlangAnalyzer } from "./analyzers/GroqSlangAnalyzer";
import { NvidiaLinguisticAnalyzer } from "./analyzers/NvidiaLinguisticAnalyzer";
import { NvidiaSlangAnalyzer } from "./analyzers/NvidiaSlangAnalyzer";
import { withFallback } from "./resilience";
import { NvidiaJournalAnalyzer } from "./analyzers/NvidiaJournalAnalyzer";

// Singleton instances — primary providers
const expressionRepository = new PrismaExpressionRepository();
const journalRepository = new PrismaJournalRepository();

const timeout = { timeoutMs: 10000 };

// Resilient analyzer for Journal: Groq -> Nvidia
export const journalAnalyzer = withFallback(
  new GroqJournalAnalyzer(),
  new NvidiaJournalAnalyzer(),
  timeout
);

// Resilient analyzers: Groq -> Nvidia (10s timeout)
export const linguisticAnalyzer = withFallback(
  new GroqLinguisticAnalyzer(),
  new NvidiaLinguisticAnalyzer(),
  timeout
);

const slangAnalyzer = withFallback(
  new GroqSlangAnalyzer(),
  new NvidiaSlangAnalyzer(),
  timeout
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
