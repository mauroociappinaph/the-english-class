import { ExpressionDetail, CreateExpressionDto } from "../types";
import { StudyMetadata } from "../types/study";

export interface IExpressionRepository {
  findByText(text: string): Promise<ExpressionDetail | null>;
  findById(id: string): Promise<ExpressionDetail | null>;
  findAll(): Promise<ExpressionDetail[]>;
  findDueForReview(limit: number): Promise<ExpressionDetail[]>;
  save(expression: CreateExpressionDto): Promise<ExpressionDetail>;
  update(id: string, expression: CreateExpressionDto): Promise<ExpressionDetail>;
  updateStudyProgress(id: string, study: StudyMetadata): Promise<ExpressionDetail>;
  delete(id: string): Promise<void>;
}
