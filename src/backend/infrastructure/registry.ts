import { ExpressionService } from "../services/ExpressionService";
import { JournalService } from "../services/JournalService";
import { PrismaExpressionRepository } from "./repositories/PrismaExpressionRepository";
import { PrismaJournalRepository } from "./repositories/PrismaJournalRepository";
import { PrismaAchievementRepository } from "./repositories/PrismaAchievementRepository";
import { AchievementService } from "../services/AchievementService";
import { GroqLinguisticAnalyzer } from "./analyzers/GroqLinguisticAnalyzer";
import { GroqJournalAnalyzer } from "./analyzers/GroqJournalAnalyzer";
import { NvidiaLinguisticAnalyzer } from "./analyzers/NvidiaLinguisticAnalyzer";
import { withFallback } from "./resilience";
import { NvidiaJournalAnalyzer } from "./analyzers/NvidiaJournalAnalyzer";

// Singleton instances — primary providers
const expressionRepository = new PrismaExpressionRepository();
const journalRepository = new PrismaJournalRepository();
const achievementRepository = new PrismaAchievementRepository();

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

export const expressionService = new ExpressionService(
  expressionRepository,
  linguisticAnalyzer
);

export const journalService = new JournalService(
  journalRepository,
  journalAnalyzer
);

export const achievementService = new AchievementService(
  achievementRepository,
  expressionRepository
);
