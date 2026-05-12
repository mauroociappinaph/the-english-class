/**
 * Specific metrics for structural analysis.
 */
export interface InterfaceMetrics {
  name: string;
  properties: number;
  maxNesting: number;
  complexity: number;
  optionalRatio: number;
  unionComplexity: number;
  isRecursive: boolean;
}


// Re-exporting global types for backward compatibility during migration
import { Issue, AuditStats, Report } from '../types/analyzer.types';
export * from '../types/analyzer.types';

export type AnalyzerIssue = Issue;
export type { AuditStats as GlobalAuditStats };


