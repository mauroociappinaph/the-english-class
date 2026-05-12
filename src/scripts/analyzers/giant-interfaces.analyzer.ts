import { Project, InterfaceDeclaration, TypeAliasDeclaration, Node, Type, Symbol, SourceFile } from 'ts-morph';

import { Issue, Analyzer, AnalysisContext, AnalyzerResult, GiantInterfaceRules } from '../types/analyzer.types';
import { InterfaceMetrics } from '../types/analyzer';


/**
 * GiantInterfacesAnalyzer: Enforcement of the Interface Segregation Principle (ISP).
 * Detects interfaces that are too complex, deeply nested, or have too many responsibilities.
 */
export class GiantInterfacesAnalyzer implements Analyzer {
  public readonly name = 'Interface Cohesion Analyzer (ISP)';
  public readonly isGlobal = false;


  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.analyzeProject(context.project, context.giantInterfaceRules, context.changedFiles);

    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  public analyzeProject(project: Project, thresholds: GiantInterfaceRules, filesToAnalyze?: string[]): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = filesToAnalyze 
      ? filesToAnalyze.map(f => project.getSourceFile(f)).filter((sf): sf is SourceFile => !!sf)
      : project.getSourceFiles();



    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      if (filePath.includes('node_modules')) return;

      // Analyze Interfaces
      sourceFile.getInterfaces().forEach(node => {
        const metrics = this.calculateMetrics(node);
        if (this.isGiant(metrics, thresholds)) {
          issues.push(this.createIssue(sourceFile.getFilePath(), node, metrics, thresholds));
        }
      });

      // Analyze Type Aliases (if they are object-like)
      sourceFile.getTypeAliases().forEach(node => {
        if (node.getType().isObject()) {
          const metrics = this.calculateMetrics(node);
          if (this.isGiant(metrics, thresholds)) {
            issues.push(this.createIssue(sourceFile.getFilePath(), node, metrics, thresholds));
          }
        }
      });
    });

    return issues;
  }

  private calculateMetrics(node: InterfaceDeclaration | TypeAliasDeclaration): InterfaceMetrics {
    const properties = node.getType().getProperties();
    const propertyCount = properties.length;
    
    let maxNesting = 0;
    const checkNesting = (type: Type, level: number) => {
      maxNesting = Math.max(maxNesting, level);
      if (level > 10) return;

      const props = type.getProperties();
      props.forEach((p: Symbol) => {
        const propType = p.getTypeAtLocation(node);
        if (propType.isObject() && !propType.isArray()) {
          checkNesting(propType, level + 1);
        }
      });
    };
    
    checkNesting(node.getType(), 1);
    const complexity = node.getDescendants().length;

    return { 
      name: node.getName() || 'anonymous', 
      properties: propertyCount, 
      maxNesting, 
      complexity 
    };
  }

  private isGiant(metrics: InterfaceMetrics, t: GiantInterfaceRules): boolean {
    return (
      metrics.properties > t.maxProperties ||
      metrics.maxNesting > t.maxNesting ||
      metrics.complexity > t.complexityThreshold
    );
  }

  private createIssue(file: string, node: Node, metrics: InterfaceMetrics, t: GiantInterfaceRules): Issue {
    const severity = metrics.properties > t.maxProperties * 1.5 || metrics.maxNesting > t.maxNesting + 1 ? 'HIGH' : 'MEDIUM';
    
    let suggestion = `Interface "${metrics.name}" is too large. `;
    if (metrics.properties > t.maxProperties) {
      suggestion += `Split it into smaller, specialized interfaces using composition. `;
    }
    if (metrics.maxNesting > t.maxNesting) {
      suggestion += `Flatten the structure or extract nested objects into their own named types. `;
    }

    return {
      file,
      line: node.getStartLineNumber(),
      severity,
      explanation: `Giant Interface Detected: ${metrics.name} (Props: ${metrics.properties}, Nesting: ${metrics.maxNesting}, Complexity: ${metrics.complexity})`,
      suggestion,
      analyzer: 'GiantInterfacesAnalyzer'
    };
  }
}
