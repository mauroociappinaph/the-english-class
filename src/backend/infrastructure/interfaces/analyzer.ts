/**
 * Standard Issue format for all architectural analyzers
 */
export interface AnalyzerIssue {
  file: string;
  line: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  suggestion: string;
  analyzer: string;
}


export interface InterfaceMetrics {
  name: string;
  propertyCount: number;
  maxNesting: number;
  complexity: number;
}

export interface AuditStats {
  total: number;
  criticals: number;
  warnings: number;
  suggestions: number;
  score: number;
  durationMs: number;
}


