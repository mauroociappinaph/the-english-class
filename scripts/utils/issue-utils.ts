import { AnalyzerIssue } from '../types/analyzer';

/**
 * Common utilities for processing and reporting issues.
 */
export class IssueUtils {
  /**
   * Sorts issues by severity: HIGH > MEDIUM > LOW
   */
  static sortIssues<T extends { severity: string }>(issues: T[]): T[] {
    const severityMap: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return [...issues].sort((a, b) => severityMap[a.severity] - severityMap[b.severity]);
  }

  /**
   * Generic grouping utility.
   */
  private static groupByKey<T>(items: T[], keyGetter: (item: T) => string): Map<string, T[]> {
    const map = new Map<string, T[]>();
    items.forEach(item => {
      const key = keyGetter(item);
      const group = map.get(key) || [];
      group.push(item);
      map.set(key, group);
    });
    return map;
  }

  /**
   * Groups issues by their analyzer name.
   */
  static groupByAnalyzer<T extends { analyzer: string }>(issues: T[]): Map<string, T[]> {
    return this.groupByKey(issues, i => i.analyzer);
  }

  /**
   * Groups issues by their file path.
   */
  static groupByFile<T extends { file: string }>(issues: T[]): Map<string, T[]> {
    return this.groupByKey(issues, i => i.file);
  }
}
