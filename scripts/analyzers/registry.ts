import { Analyzer } from '../types/analyzer.types';
import { AnyUsageAnalyzer } from './any-usage.analyzer';
import { CircularDepsAnalyzer } from './circular-deps.analyzer';
import { GiantInterfacesAnalyzer } from './giant-interfaces.analyzer';
import { CouplingMetricsAnalyzer } from './coupling-metrics.analyzer';
import { ArchitectureBoundaryAnalyzer } from './architecture-boundary.analyzer';
import { SecurityEnvLeakAnalyzer } from './security-env-leak.analyzer';
import { DeadCodeAnalyzer } from './dead-code.analyzer';
import { SecurityOwaspAnalyzer } from './security-owasp.analyzer';
import { DuplicateLogicAnalyzer } from './duplicate-logic.analyzer';

export const getProjectAnalyzers = (): Analyzer[] => [
  new DeadCodeAnalyzer(),
  new AnyUsageAnalyzer(),
  new CircularDepsAnalyzer(),
  new GiantInterfacesAnalyzer(),
  new CouplingMetricsAnalyzer(),
  new ArchitectureBoundaryAnalyzer(),
  new SecurityEnvLeakAnalyzer(),
  new SecurityOwaspAnalyzer(),
  new DuplicateLogicAnalyzer()
];
