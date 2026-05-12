import { Analyzer } from '../types/analyzer.types';
import { UnusedTypesAnalyzer } from './unused-types.analyzer';
import { AnyUsageAnalyzer } from './any-usage.analyzer';
import { CircularDepsAnalyzer } from './circular-deps.analyzer';
import { GiantInterfacesAnalyzer } from './giant-interfaces.analyzer';
import { CouplingMetricsAnalyzer } from './coupling-metrics.analyzer';
import { ArchitectureBoundaryAnalyzer } from './architecture-boundary.analyzer';

export const getProjectAnalyzers = (): Analyzer[] => [
  new UnusedTypesAnalyzer(),
  new AnyUsageAnalyzer(),
  new CircularDepsAnalyzer(),
  new GiantInterfacesAnalyzer(),
  new CouplingMetricsAnalyzer(),
  new ArchitectureBoundaryAnalyzer()
];
