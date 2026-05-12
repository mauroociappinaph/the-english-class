import { Project, SourceFile } from 'ts-morph';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult, CouplingMetrics } from '../types/analyzer.types';
import path from 'path';

/**
 * CouplingMetricsAnalyzer: Calculates mathematical coupling and instability.
 * Based on Robert C. Martin's clean architecture metrics.
 */
export class CouplingMetricsAnalyzer implements Analyzer {
  public readonly name = 'Coupling Metrics Analyzer (Martin)';
  public readonly isGlobal = true;

  private projectRoot: string = process.cwd();

  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.analyzeProject(context);

    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  public analyzeProject(context: AnalysisContext): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = context.project.getSourceFiles().filter(sf => {
      const path = sf.getFilePath();
      return !path.includes('node_modules') && !path.endsWith('.d.ts') && !path.endsWith('.d.mts');
    });

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
          explanation: `High Efferent Coupling (Ce=${ce}): Este módulo depende de demasiados componentes internos. Probablemente esté violando el Single Responsibility Principle.`,
          suggestion: 'Refactorizar extrayendo responsabilidades o usar Facades para reducir dependencias.',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }

      // Rule 2: High Instability in Core Domain (Domain should be stable I=0)
      if (relativePath.includes('/domain/') && instability > CRITICAL_INSTABILITY_THRESHOLD && ce > 3) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'MEDIUM',
          explanation: `Domain Instability (I=${instability.toFixed(2)}): Este módulo del dominio es altamente inestable porque depende de demasiadas cosas (Ce=${ce}, Ca=${ca}). El dominio debe ser estable.`,
          suggestion: 'Invertir dependencias usando interfaces. El dominio no debería depender de otros detalles.',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }

      // Rule 3: God Classes / Hubs (High Ce and High Ca)
      if (ce > 10 && ca > 10) {
         issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `Architectural Hub Detectado (Ce=${ce}, Ca=${ca}): Este módulo es un cuello de botella. Muchos dependen de él, y él depende de muchos. Modificarlo es altamente riesgoso.`,
          suggestion: 'Dividir el módulo. Separar las interfaces/tipos (para bajar Ca) de la implementación (para bajar Ce).',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }
    });


    return issues;
  }
}
