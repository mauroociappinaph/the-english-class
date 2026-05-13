import { ExpressionService } from "../services/ExpressionService";
import { JournalService } from "../services/JournalService";
import { PrismaExpressionRepository } from "./repositories/PrismaExpressionRepository";
import { PrismaJournalRepository } from "./repositories/PrismaJournalRepository";
import { GroqLinguisticAnalyzer } from "./analyzers/GroqLinguisticAnalyzer";
import { GroqJournalAnalyzer } from "./analyzers/GroqJournalAnalyzer";
import { GroqSlangAnalyzer } from "./analyzers/GroqSlangAnalyzer";
import { GeminiLinguisticAnalyzer } from "./analyzers/GeminiLinguisticAnalyzer";
import { GeminiSlangAnalyzer } from "./analyzers/GeminiSlangAnalyzer";
import { NvidiaLinguisticAnalyzer } from "./analyzers/NvidiaLinguisticAnalyzer";
import { NvidiaSlangAnalyzer } from "./analyzers/NvidiaSlangAnalyzer";
import { withFallback } from "./resilience";

import { NvidiaJournalAnalyzer } from "./analyzers/NvidiaJournalAnalyzer";

import { GeminiJournalAnalyzer } from "./analyzers/GeminiJournalAnalyzer";

// Singleton instances — primary providers
const expressionRepository = new PrismaExpressionRepository();
const journalRepository = new PrismaJournalRepository();

// Resilient analyzer for Journal: Nvidia -> Groq -> Gemini
export const journalAnalyzer = withFallback(
  new NvidiaJournalAnalyzer(),
  withFallback(
    new GroqJournalAnalyzer(),
    new GeminiJournalAnalyzer()
  )
);

// Resilient analyzers: Nvidia (35s) → Gemini (15s) → Groq (10s) on 429/503/Timeout
export const linguisticAnalyzer = withFallback(
  new NvidiaLinguisticAnalyzer(),
  withFallback(
    new GeminiLinguisticAnalyzer(),
    new GroqLinguisticAnalyzer(),
    { timeoutMs: 15000 }
  ),
  { timeoutMs: 35000 }
);

export const slangAnalyzer = withFallback(
  new NvidiaSlangAnalyzer(),
  withFallback(
    new GeminiSlangAnalyzer(),
    new GroqSlangAnalyzer(),
    { timeoutMs: 15000 }
  ),
  { timeoutMs: 35000 }
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

