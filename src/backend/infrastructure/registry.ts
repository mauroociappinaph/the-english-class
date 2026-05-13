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

// Resilient analyzer for Journal: Groq -> Nvidia -> Gemini
export const journalAnalyzer = withFallback(
  new GroqJournalAnalyzer(),
  withFallback(
    new NvidiaJournalAnalyzer(),
    new GeminiJournalAnalyzer()
  )
);

// Resilient analyzers: Groq → Nvidia → Gemini on 429/503
export const linguisticAnalyzer = withFallback(
  new GroqLinguisticAnalyzer(),
  withFallback(
    new NvidiaLinguisticAnalyzer(),
    new GeminiLinguisticAnalyzer()
  )
);

export const slangAnalyzer = withFallback(
  new GroqSlangAnalyzer(),
  withFallback(
    new NvidiaSlangAnalyzer(),
    new GeminiSlangAnalyzer()
  )
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

