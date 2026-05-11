import { Project, InterfaceDeclaration, TypeAliasDeclaration, Node, Type, Symbol } from 'ts-morph';
import { AnalyzerIssue, InterfaceMetrics } from '../interfaces/analyzer';

/**
 * GiantInterfacesAnalyzer: Enforcement of the Interface Segregation Principle (ISP).
 * Detects interfaces that are too complex, deeply nested, or have too many responsibilities.
 */
export class GiantInterfacesAnalyzer {
  private readonly MAX_PROPERTIES = 20;
  private readonly MAX_NESTING = 3;
  private readonly COMPLEXITY_THRESHOLD = 300;

  public analyzeProject(project: Project): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const sourceFiles = project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      if (filePath.includes('node_modules')) return;

      // Analyze Interfaces
      sourceFile.getInterfaces().forEach(node => {
        const metrics = this.calculateMetrics(node);
        if (this.isGiant(metrics)) {
          issues.push(this.createIssue(sourceFile.getFilePath(), node, metrics));
        }
      });

      // Analyze Type Aliases (if they are object-like)
      sourceFile.getTypeAliases().forEach(node => {
        if (node.getType().isObject()) {
          const metrics = this.calculateMetrics(node);
          if (this.isGiant(metrics)) {
            issues.push(this.createIssue(sourceFile.getFilePath(), node, metrics));
          }
        }
      });
    });

    return issues;
  }

  private calculateMetrics(node: InterfaceDeclaration | TypeAliasDeclaration): InterfaceMetrics {
    const properties = node.getType().getProperties();
    const propertyCount = properties.length;
    
    // Calculate max nesting level
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

    // Calculate total AST nodes as a proxy for complexity
    const complexity = node.getDescendants().length;

    return { propertyCount, maxNesting, complexity, name: node.getName() || 'anonymous' };
  }

  private isGiant(metrics: InterfaceMetrics): boolean {
    return (
      metrics.propertyCount > this.MAX_PROPERTIES ||
      metrics.maxNesting > this.MAX_NESTING ||
      metrics.complexity > this.COMPLEXITY_THRESHOLD
    );
  }

  private createIssue(file: string, node: Node, metrics: InterfaceMetrics): AnalyzerIssue {
    const severity = metrics.propertyCount > 25 || metrics.maxNesting > 4 || metrics.complexity > 500 ? 'HIGH' : 'MEDIUM';
    
    let suggestion = `Interface "${metrics.name}" is too large. `;
    if (metrics.propertyCount > this.MAX_PROPERTIES) {
      suggestion += `Split it into smaller, specialized interfaces using composition. `;
    }
    if (metrics.maxNesting > this.MAX_NESTING) {
      suggestion += `Flatten the structure or extract nested objects into their own named types. `;
    }

    return {
      file,
      line: node.getStartLineNumber(),
      severity,
      explanation: `Giant Interface Detected: ${metrics.name} (Props: ${metrics.propertyCount}, Nesting: ${metrics.maxNesting}, Complexity: ${metrics.complexity})`,
      suggestion
    };
  }
}
