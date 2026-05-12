import { Project, InterfaceDeclaration, TypeAliasDeclaration, Node, Type, Symbol, SourceFile } from 'ts-morph';
import path from 'path';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult, GiantInterfaceRules } from '../types/analyzer.types';
import { InterfaceMetrics } from '../types/analyzer';

/**
 * GiantInterfacesAnalyzer: Enforcement of the Interface Segregation Principle (ISP).
 * Detects interfaces that are too complex, deeply nested, or have too many responsibilities.
 * V2: Expanded with complexity metrics (unions, recursion, optionality).
 */
export class GiantInterfacesAnalyzer implements Analyzer {
  public readonly name = 'Interface Cohesion Analyzer (ISP)';
  public readonly isGlobal = false;

  public async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
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
          const issue = this.createIssue(sourceFile.getFilePath(), node, metrics, thresholds);
          
          if (!issues.find(i => i.file === issue.file && i.line === issue.line && i.explanation === issue.explanation)) {
            issues.push(issue);
          }
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
    const name = node.getName() || 'anonymous';
    const type = node.getType();
    const properties = type.getApparentProperties();
    const propertyCount = properties.length;
    
    let optionalCount = 0;
    let unionComplexity = 0;
    let isRecursive = false;
    let maxNesting = 0;

    const checkType = (t: Type, level: number, stack: Set<string>) => {
      maxNesting = Math.max(maxNesting, level);
      
      const typeStr = t.getText();
      const isObject = t.isObject() && !t.isString() && !t.isNumber() && !t.isBoolean() && !t.isEnum();
      const symbol = t.getSymbol();
      const isExternal = symbol?.getDeclarations().some(d => d.getSourceFile().getFilePath().includes('node_modules')) ?? false;

      // Exclude built-ins, external types, and large external objects
      const blacklist = ['Date', 'Function', 'Promise', 'Project', 'Node', 'SourceFile', 'React'];
      if (isExternal || blacklist.includes(typeStr) || typeStr.startsWith('import(') && blacklist.some(b => typeStr.includes('.' + b))) {
        return;
      }

      if (isObject && stack.has(typeStr)) {
        isRecursive = true;
        return;
      }

      if (level > 10) return;

      if (t.isUnion()) {
        unionComplexity += t.getUnionTypes().length;
      }

      const nextStack = new Set(stack);
      if (isObject) nextStack.add(typeStr);

      const props = t.getApparentProperties();
      props.forEach((p: Symbol) => {
        if (p.isOptional()) optionalCount++;
        
        const propType = p.getTypeAtLocation(node).getNonNullableType();
        // Check if it's an object-like type (interface, class, or type literal)
        if (propType.isObject() && !propType.isArray() && !propType.isString() && !propType.isNumber()) {
          checkType(propType, level + 1, nextStack);
        }
      });
    };
    
    checkType(type, 1, new Set());
    const complexity = node.getDescendants().length;
    const optionalRatio = propertyCount > 0 ? optionalCount / propertyCount : 0;


    return { 
      name, 
      properties: propertyCount, 
      maxNesting, 
      complexity,
      optionalRatio,
      unionComplexity,
      isRecursive
    };
  }

  private isGiant(metrics: InterfaceMetrics, t: GiantInterfaceRules): boolean {
    if (!t) return false;
    return (
      metrics.properties > t.maxProperties ||
      metrics.maxNesting > t.maxNesting ||
      metrics.complexity > t.complexityThreshold ||
      metrics.isRecursive ||
      metrics.unionComplexity > 5
    );
  }

  private createIssue(file: string, node: Node, metrics: InterfaceMetrics, t: GiantInterfaceRules): Issue {
    const severity = metrics.properties > t.maxProperties * 1.5 || metrics.isRecursive ? 'HIGH' : 'MEDIUM';
    
    let suggestion = `Interface "${metrics.name}" exceeds architectural thresholds. `;
    if (metrics.properties > t.maxProperties) {
      suggestion += `Split it into smaller, specialized interfaces (Props: ${metrics.properties}). `;
    }
    if (metrics.isRecursive) {
      suggestion += `Recursive types detected. Ensure base cases are simple. `;
    }
    if (metrics.unionComplexity > 5) {
      suggestion += `High union complexity (${metrics.unionComplexity}). `;
    }

    return {
      file,
      line: node.getStartLineNumber(),
      severity,
      explanation: `Complexity Threshold Exceeded: ${metrics.name} [Props: ${metrics.properties}, Nest: ${metrics.maxNesting}, Rec: ${metrics.isRecursive}, Union: ${metrics.unionComplexity}]`,
      suggestion,
      analyzer: 'Interface Cohesion Analyzer (ISP)'
    };
  }
}
