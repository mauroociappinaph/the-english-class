import fs from 'fs';
import path from 'path';
import { AnalyzerIssue, AuditStats } from '../types/analyzer';
import { MarkdownReporter } from './markdown.report';
import { JsonReporter } from './json.report';
import { QualityScoreCalculator } from './quality-score';
import { IssueUtils } from '../utils/issue-utils';




/**
 * ReportGenerator: Orchestrator of architectural visibility.

 * Consolidates issues from all analyzers into actionable reports.
 */
export class ReportGenerator {
  private issues: AnalyzerIssue[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  public addIssues(issues: AnalyzerIssue[]): void {
    this.issues.push(...issues);
  }

  public clearIssues(): void {
    this.issues = [];
  }

  /**
   * Generates all report formats
   */
  public generate(outputDir: string = 'reports'): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const stats = this.calculateStats();
    const sortedIssues = IssueUtils.sortIssues(this.issues);
    const groupedIssues = IssueUtils.groupByAnalyzer(sortedIssues);

    this.writeJson(outputDir, stats, sortedIssues);
    this.writeMarkdown(outputDir, stats, sortedIssues);
    this.writeHtml(outputDir, stats, groupedIssues);

    
    console.log(`\n\x1b[32m✅ Reports generated in /${outputDir}\x1b[0m`);
  }

  private calculateStats(): AuditStats {
    const criticals = this.issues.filter(i => i.severity === 'HIGH').length;
    const warnings = this.issues.filter(i => i.severity === 'MEDIUM').length;
    const suggestions = this.issues.filter(i => i.severity === 'LOW').length;
    
    const calculator = new QualityScoreCalculator();
    const scoreBreakdown = calculator.calculate(this.issues);

    return {
      total: this.issues.length,
      criticals,
      warnings,
      suggestions,
      score: scoreBreakdown.total,
      durationMs: Date.now() - this.startTime
    };

  }

  private writeReport<T extends { generate: (stats: AuditStats, issues: AnalyzerIssue[]) => string }>(
    ReporterClass: new () => T,
    stats: AuditStats,
    issues: AnalyzerIssue[],
    filename: string,
    dir: string
  ): void {
    const reporter = new ReporterClass();
    const content = reporter.generate(stats, issues);
    fs.writeFileSync(path.join(dir, filename), content);
  }

  private writeJson(dir: string, stats: AuditStats, issues: AnalyzerIssue[]): void {
    this.writeReport(JsonReporter, stats, issues, 'audit-report.json', dir);
  }

  private writeMarkdown(dir: string, stats: AuditStats, issues: AnalyzerIssue[]): void {
    this.writeReport(MarkdownReporter, stats, issues, 'audit-report.md', dir);
  }


  private writeHtml(dir: string, stats: AuditStats, grouped: Map<string, AnalyzerIssue[]>): void {
    const scoreColor = stats.score > 80 ? '#22c55e' : stats.score > 50 ? '#eab308' : '#ef4444';
    
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Architecture Audit</title>
      <style>
        body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #1f2937; max-width: 1200px; margin: 40px auto; padding: 0 20px; background: #f9fafb; }
        .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 24px; }
        .score-badge { font-size: 48px; font-weight: 800; color: ${scoreColor}; }
        .tag { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .tag-high { background: #fee2e2; color: #991b1b; }
        .tag-medium { background: #fef9c3; color: #854d0e; }
        .tag-low { background: #dcfce7; color: #166534; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        tr:hover { background: #f9fafb; }
        .analyzer-title { margin-top: 40px; color: #111827; border-left: 4px solid #3b82f6; padding-left: 12px; }
      </style>
    </head>
    <body>
      <div class="card" style="text-align: center">
        <h1>Architecture Audit Result</h1>
        <div class="score-badge">${stats.score}</div>
        <p>Quality Score</p>
      </div>
      
      <div class="card">
        <h2>Executive Summary</h2>
        <div style="display: flex; justify-content: space-around; text-align: center">
          <div><h3>${stats.total}</h3><p>Total Issues</p></div>
          <div style="color: #991b1b"><h3>${stats.criticals}</h3><p>Critical</p></div>
          <div style="color: #854d0e"><h3>${stats.warnings}</h3><p>Warnings</p></div>
          <div><h3>${stats.durationMs}ms</h3><p>Analysis Time</p></div>
        </div>
      </div>
    `;

    grouped.forEach((issues, analyzer) => {
      html += `<h2 class="analyzer-title">${analyzer}</h2>`;
      html += `<table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>File</th>
            <th>Line</th>
            <th>Explanation</th>
            <th>Suggestion</th>
          </tr>
        </thead>
        <tbody>`;
      
      issues.forEach(i => {
        const severityClass = `tag-${i.severity.toLowerCase()}`;
        html += `
          <tr>
            <td><span class="tag ${severityClass}">${i.severity}</span></td>
            <td><code>${path.basename(i.file)}</code></td>
            <td>${i.line}</td>
            <td>${i.explanation}</td>
            <td>${i.suggestion}</td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
    });

    html += `</body></html>`;
    fs.writeFileSync(path.join(dir, 'audit-report.html'), html);
  }
}
