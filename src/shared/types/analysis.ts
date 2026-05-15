export type AnalysisErrorCode = 
  | 'INPUT_TOO_SHORT' 
  | 'INPUT_NONSENSE' 
  | 'PROVIDER_TIMEOUT' 
  | 'PROVIDER_RATE_LIMIT' 
  | 'PARSING_FAILURE' 
  | 'UNKNOWN';

export interface AnalysisError {
  code: AnalysisErrorCode;
  message: string;
  pedagogicalTip: string;
  suggestion?: string;
}

export type AnalysisResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: AnalysisError };
