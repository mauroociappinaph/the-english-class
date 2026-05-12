import { Project } from 'ts-morph';

/**
 * Severity levels for architectural violations.
 */
export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface GiantInterfaceRules {
  maxProperties: number;
  maxNesting: number;
  complexityThreshold: number;
}

export interface AnyUsageRules {
  allowTypeAssertions: boolean;
}

export interface CircularDepRules {
  enforcePureDomain: boolean;
}

/**
 * AuditConfig: Centralized configuration for the Semantic Audit Suite.
 */
export interface AuditConfig {
  ignorePaths: string[];
  severityOverrides: Record<string, Severity>;
  rules: {
    giantInterfaces: GiantInterfaceRules;
    anyUsage: AnyUsageRules;
    circularDeps: CircularDepRules;
  };
  reporting: {
    outputDir: string;
    formats: ('json' | 'markdown' | 'html')[];
  };
}

/**
 * Context provided to analyzers during execution.
 * Fully flattened to comply with ISP.
 */
export interface AnalysisContext {
  project: Project;
  ignorePaths: string[];
  giantInterfaceRules: GiantInterfaceRules;
  anyUsageRules: AnyUsageRules;
  circularDepRules: CircularDepRules;
  startTime: number;
  changedFiles?: string[]; // Paths of files that changed since last audit
  graph: any; // Will be typed properly in the implementation
}



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
 * Contract for all semantic analyzers.
 */
export interface Analyzer {
  name: string;
  isGlobal: boolean; // TRUE: needs whole project. FALSE: can be run incrementally.
  analyze(context: AnalysisContext): AnalyzerResult;
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

export interface CouplingMetrics {
  ce: number; // Efferent Coupling (outgoing dependencies)
  ca: number; // Afferent Coupling (incoming dependencies)
  instability: number; // I = Ce / (Ce + Ca)
}

export interface CacheEntry {
  hash: string;
  issues: Issue[];
  mtime: number;
}

export interface ScoreBreakdown {
  typeSafety: number;
  architecture: number;
  maintainability: number;
  total: number;
}



