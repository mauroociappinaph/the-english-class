import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { GraphNode } from '../types/graph.types';
import path from 'path';

export class DependencyGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  public build(project: Project): void {
    this.nodes.clear();
    const sourceFiles = project.getSourceFiles();

    // 1. Initialize nodes
    sourceFiles.forEach(sf => {
      const filePath = sf.getFilePath();
      this.nodes.set(filePath, {
        path: filePath,
        imports: [],
        importedBy: [],
        isExternal: false
      });
    });

    // 2. Build edges
    sourceFiles.forEach(sf => {
      const filePath = sf.getFilePath();
      const node = this.nodes.get(filePath)!;

      sf.getImportDeclarations().forEach(imp => {
        const targetSf = imp.getModuleSpecifierSourceFile();
        if (targetSf) {
          const targetPath = targetSf.getFilePath();
          node.imports.push(targetPath);

          const targetNode = this.nodes.get(targetPath);
          if (targetNode) {
            targetNode.importedBy.push(filePath);
          }
        }
      });
    });
  }

  public getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getNode(filePath: string): GraphNode | undefined {
    return this.nodes.get(filePath);
  }

  public getIncoming(filePath: string): string[] {
    return this.nodes.get(filePath)?.importedBy || [];
  }

  public getOutgoing(filePath: string): string[] {
    return this.nodes.get(filePath)?.imports || [];
  }

  public findCycle(startNode: string): string[] | null {
    const visited = new Set<string>();
    const stack = new Set<string>();
    const pathTrace: string[] = [];

    const visit = (node: string): string[] | null => {
      if (stack.has(node)) {
        const cycleIndex = pathTrace.indexOf(node);
        return [...pathTrace.slice(cycleIndex), node];
      }
      if (visited.has(node)) return null;

      visited.add(node);
      stack.add(node);
      pathTrace.push(node);

      const neighbors = this.getOutgoing(node);
      for (const neighbor of neighbors) {
        const cycle = visit(neighbor);
        if (cycle) return cycle;
      }

      stack.delete(node);
      pathTrace.pop();
      return null;
    };

    return visit(startNode);
  }

  /**
   * Centrality (Afferent Coupling): How many modules depend on this one.
   */
  public getCentrality(filePath: string): number {
    return this.getIncoming(filePath).length;
  }

  /**
   * Instability: Ratio of efferent coupling to total coupling.
   */
  public getInstability(filePath: string): number {
    const ce = this.getOutgoing(filePath).length;
    const ca = this.getIncoming(filePath).length;
    if (ce + ca === 0) return 0;
    return ce / (ce + ca);
  }
}
