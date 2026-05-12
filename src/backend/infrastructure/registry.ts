import { ExpressionService } from "../services/ExpressionService";
import { PrismaExpressionRepository } from "./repositories/PrismaExpressionRepository";
import { GroqLinguisticAnalyzer } from "./analyzers/GroqLinguisticAnalyzer";

// Singleton instances
const expressionRepository = new PrismaExpressionRepository();
const linguisticAnalyzer = new GroqLinguisticAnalyzer();

export const expressionService = new ExpressionService(
  expressionRepository,
  linguisticAnalyzer
);
