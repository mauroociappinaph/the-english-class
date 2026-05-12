import { ExpressionService } from "../services/ExpressionService";
import { JournalService } from "../services/JournalService";
import { PrismaExpressionRepository } from "./repositories/PrismaExpressionRepository";
import { PrismaJournalRepository } from "./repositories/PrismaJournalRepository";
import { GroqLinguisticAnalyzer } from "./analyzers/GroqLinguisticAnalyzer";
import { GroqJournalAnalyzer } from "./analyzers/GroqJournalAnalyzer";

// Singleton instances
const expressionRepository = new PrismaExpressionRepository();
const journalRepository = new PrismaJournalRepository();
const linguisticAnalyzer = new GroqLinguisticAnalyzer();
const journalAnalyzer = new GroqJournalAnalyzer();

export const expressionService = new ExpressionService(
  expressionRepository,
  linguisticAnalyzer
);

export const journalService = new JournalService(
  journalRepository,
  journalAnalyzer
);

