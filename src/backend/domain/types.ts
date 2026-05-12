import { 
  Expression as SharedExpression, 
  Example as SharedExample,
  UsageTips as SharedUsageTips,
  Tense as SharedTense,
  CreateExpressionDto as SharedCreateExpressionDto
} from "@/shared/types/expression";

export interface GroqExample extends Omit<SharedExample, 'id' | 'expressionId' | 'createdAt' | 'updatedAt'> {}

interface GroqTense extends SharedTense {}

interface GroqUsageTips extends SharedUsageTips {}

export interface GroqExpressionResponse extends Omit<SharedExpression, 'id' | 'createdAt' | 'updatedAt' | 'examples' | 'usageTips' | 'tenses' | 'imageUrl'> {
  imageUrl: string;
  usageTips: GroqUsageTips;
  tenses: Record<string, GroqTense>;
  examples: GroqExample[];
}

export interface ExpressionDetail extends SharedExpression {}

export type CreateExpressionDto = SharedCreateExpressionDto;
