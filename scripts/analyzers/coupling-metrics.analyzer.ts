import { Issue, AnalysisContext, CouplingMetrics } from '../types/analyzer.types';
import { ProjectUtils } from '../utils/project-utils';
import { BaseAnalyzer } from './base.analyzer';
import path from 'path';

/**
 * CouplingMetricsAnalyzer: Calculates mathematical coupling and instability.
 * Based on Robert C. Martin's clean architecture metrics.
 */
export class CouplingMetricsAnalyzer extends BaseAnalyzer {
  public readonly name = 'Coupling Metrics Analyzer (Martin)';
  public readonly isGlobal = true;

  private projectRoot: string = process.cwd();

  protected runAnalysis(context: AnalysisContext): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = ProjectUtils.getRelevantSourceFiles(context.project);

    const HIGH_CE_THRESHOLD = 15; // Too many outgoing dependencies (God Object / Spaghetti)
    const CRITICAL_INSTABILITY_THRESHOLD = 0.9;

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const node = context.graph.getNode(filePath);
      if (!node) return;

      const ce = node.imports.length;
      const ca = node.importedBy.length;
      const instability = context.graph.getInstability(filePath);
      const relativePath = path.relative(this.projectRoot, filePath);


      // Rule 1: High Efferent Coupling (Too many dependencies)
      if (ce > HIGH_CE_THRESHOLD) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `High Efferent Coupling (Ce=${ce}): This module depends on too many internal components, likely violating the Single Responsibility Principle.`,
          suggestion: 'Refactor by extracting responsibilities or using Facades to reduce direct dependencies.',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }

      // Rule 2: High Instability in Core Domain (Domain should be stable I=0)
      if (relativePath.includes('/domain/') && instability > CRITICAL_INSTABILITY_THRESHOLD && ce > 3) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'MEDIUM',
          explanation: `Domain Instability (I=${instability.toFixed(2)}): This domain module is highly unstable because it depends on too many external abstractions (Ce=${ce}, Ca=${ca}). The core domain should be stable.`,
          suggestion: 'Invert dependencies using interfaces. The domain should not depend on lower-level details.',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }

      // Rule 3: God Classes / Hubs (High Ce and High Ca)
      if (ce > 10 && ca > 10) {
         issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `Architectural Hub Detected (Ce=${ce}, Ca=${ca}): This module is a bottleneck. Many depend on it, and it depends on many. Modifying it is high risk.`,
          suggestion: 'Split the module. Separate interfaces/types (to lower Ca) from implementations (to lower Ce).',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }
    });


    return issues;
  }
}
