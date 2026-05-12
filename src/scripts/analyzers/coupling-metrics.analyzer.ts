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
    const issues = this.analyzeProject(context.project);
    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  public analyzeProject(project: Project): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = project.getSourceFiles().filter(sf => {
      const path = sf.getFilePath();
      return !path.includes('node_modules') && !path.endsWith('.d.ts') && !path.endsWith('.d.mts');
    });

    const metricsMap = new Map<string, CouplingMetrics>();
    
    // Initialize metrics
    sourceFiles.forEach(sf => {
      metricsMap.set(sf.getFilePath(), { ce: 0, ca: 0, instability: 0 });
    });

    // Calculate Ce (Efferent) and Ca (Afferent)
    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const currentMetrics = metricsMap.get(filePath)!;
      
      const imports = sourceFile.getImportDeclarations();
      
      // Count internal dependencies for Ce
      imports.forEach(imp => {
        const importedFile = imp.getModuleSpecifierSourceFile();
        if (importedFile && metricsMap.has(importedFile.getFilePath())) {
          currentMetrics.ce += 1;
          
          // Increment Ca for the imported file
          const importedMetrics = metricsMap.get(importedFile.getFilePath())!;
          importedMetrics.ca += 1;
        }
      });
    });

    // Calculate Instability and generate issues
    const HIGH_CE_THRESHOLD = 15; // Too many outgoing dependencies (God Object / Spaghetti)
    const CRITICAL_INSTABILITY_THRESHOLD = 0.9;

    metricsMap.forEach((metrics, filePath) => {
      const totalCoupling = metrics.ce + metrics.ca;
      // Calculate Instability: I = Ce / (Ce + Ca). Range [0, 1]
      // I=0 (Highly Stable, independent), I=1 (Highly Unstable, dependent)
      metrics.instability = totalCoupling === 0 ? 0 : metrics.ce / totalCoupling;

      const relativePath = path.relative(this.projectRoot, filePath);

      // Rule 1: High Efferent Coupling (Too many dependencies)
      if (metrics.ce > HIGH_CE_THRESHOLD) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `High Efferent Coupling (Ce=${metrics.ce}): Este módulo depende de demasiados componentes internos. Probablemente esté violando el Single Responsibility Principle.`,
          suggestion: 'Refactorizar extrayendo responsabilidades o usar Facades para reducir dependencias.',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }

      // Rule 2: High Instability in Core Domain (Domain should be stable I=0)
      if (relativePath.includes('/domain/') && metrics.instability > CRITICAL_INSTABILITY_THRESHOLD && metrics.ce > 3) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'MEDIUM',
          explanation: `Domain Instability (I=${metrics.instability.toFixed(2)}): Este módulo del dominio es altamente inestable porque depende de demasiadas cosas (Ce=${metrics.ce}, Ca=${metrics.ca}). El dominio debe ser estable.`,
          suggestion: 'Invertir dependencias usando interfaces. El dominio no debería depender de otros detalles.',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }

      // Rule 3: God Classes / Hubs (High Ce and High Ca)
      if (metrics.ce > 10 && metrics.ca > 10) {
         issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `Architectural Hub Detectado (Ce=${metrics.ce}, Ca=${metrics.ca}): Este módulo es un cuello de botella. Muchos dependen de él, y él depende de muchos. Modificarlo es altamente riesgoso.`,
          suggestion: 'Dividir el módulo. Separar las interfaces/tipos (para bajar Ca) de la implementación (para bajar Ce).',
          analyzer: 'CouplingMetricsAnalyzer'
        });
      }
    });

    return issues;
  }
}
