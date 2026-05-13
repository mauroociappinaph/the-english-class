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

// Resilient analyzer for Journal: Groq -> Nvidia
export const journalAnalyzer = withFallback(
  new GroqJournalAnalyzer(),
  new NvidiaJournalAnalyzer(),
  { timeoutMs: 1000 }
);

// Resilient analyzers: Groq -> Nvidia (1s timeout)
export const linguisticAnalyzer = withFallback(
  new GroqLinguisticAnalyzer(),
  new NvidiaLinguisticAnalyzer(),
  { timeoutMs: 1000 }
);

export const slangAnalyzer = withFallback(
  new GroqSlangAnalyzer(),
  new NvidiaSlangAnalyzer(),
  { timeoutMs: 1000 }
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

