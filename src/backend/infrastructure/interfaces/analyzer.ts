/**
 * Specific metrics for structural analysis.
 */
export interface InterfaceMetrics {
  properties: number;
  maxNesting: number;
  complexity: number;
}

// Re-exporting global types for backward compatibility during migration
import { Issue, AuditStats, Report } from '../types/analyzer.types';
export * from '../types/analyzer.types';

export type AnalyzerIssue = Issue;
export type { AuditStats as GlobalAuditStats };
export type JsonAuditReport = Report;

