/**
 * Standard Issue format for all architectural analyzers
 */
export interface AnalyzerIssue {
  file: string;
  line: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  suggestion: string;
}
