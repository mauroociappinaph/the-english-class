import { ExpressionDetail, CreateExpressionDto } from "../types";
import { StudyPerformance } from "@/shared/types/expression";

export interface IExpressionRepository {
  findByText(text: string): Promise<ExpressionDetail | null>;
  findById(id: string): Promise<ExpressionDetail | null>;
  findAll(): Promise<ExpressionDetail[]>;
  findDueForReview(limit: number): Promise<ExpressionDetail[]>;
  save(expression: CreateExpressionDto): Promise<ExpressionDetail>;
  updateStudyProgress(id: string, performance: StudyPerformance): Promise<ExpressionDetail>;
  delete(id: string): Promise<void>;
}
