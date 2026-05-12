import { ExpressionDetail, CreateExpressionDto } from "../types";

export interface IExpressionRepository {
  findByText(text: string): Promise<ExpressionDetail | null>;
  findAll(): Promise<ExpressionDetail[]>;
  save(expression: CreateExpressionDto): Promise<ExpressionDetail>;
  delete(id: string): Promise<void>;
}
