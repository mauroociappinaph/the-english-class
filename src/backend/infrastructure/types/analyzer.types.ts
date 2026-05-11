import { Project } from 'ts-morph';
import { AuditConfig } from '../config';

/**
 * Severity levels for architectural violations.
 */
export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * Represents a single violation or suggestion found during analysis.
 */
export interface Issue {
  file: string;
  line: number;
  severity: Severity;
  explanation: string;
  suggestion: string;
  analyzer: string;
}

/**
 * Result of an individual analyzer execution.
 */
export interface AnalyzerResult {
  analyzerName: string;
  issues: Issue[];
  executionTimeMs: number;
}

/**
 * Global audit statistics.
 */
export interface AuditStats {
  total: number;
  criticals: number;
  warnings: number;
  suggestions: number;
  score: number;
  durationMs: number;
}

/**
 * Context provided to analyzers during execution.
 */
export interface AnalysisContext {
  project: Project;
  config: AuditConfig;
  startTime: number;
}

/**
 * Contract for all semantic analyzers.
 */
export interface Analyzer {
  name: string;
  analyze(context: AnalysisContext): AnalyzerResult;
}

/**
 * Represents an architectural rule to be enforced.
 */
export interface Rule {
  id: string;
  name: string;
  description: string;
  defaultSeverity: Severity;
  enabled: boolean;
}

/**
 * Final consolidated audit report structure.
 */
export interface Report {
  schemaVersion: string;
  metadata: {
    generatedAt: string;
    project: string;
    environment: string;
    nodeVersion: string;
  };
  stats: AuditStats;
  results: AnalyzerResult[];
  allIssues: Issue[];
}
