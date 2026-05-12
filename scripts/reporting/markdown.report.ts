import { AnalyzerIssue, AuditStats } from '../types/analyzer';
import { IssueUtils } from '../utils/issue-utils';


/**
 * MarkdownReporter: Specialized in generating high-impact GitHub-flavored Markdown.
 * Focused on readability, visual severity, and executive summaries.
 */
export class MarkdownReporter {
  private readonly SEVERITY_EMOJI = {
    HIGH: '🔴',
    MEDIUM: '🟡',
    LOW: '🟢',
  };

  public generate(stats: AuditStats, issues: AnalyzerIssue[]): string {
    const sortedIssues = IssueUtils.sortIssues(issues);
    const groupedByAnalyzer = IssueUtils.groupByAnalyzer(sortedIssues);

    let md = `# 🛡️ Architecture Audit Report\n\n`;
    
    md += this.renderExecutiveSummary(stats);
    md += this.renderTableOfContents(groupedByAnalyzer);
    md += this.renderMetrics(stats);
    
    md += `---\n\n`;
    md += `## 🔍 Detailed Analysis\n\n`;

    groupedByAnalyzer.forEach((issues, analyzer) => {
      md += `### ${analyzer}\n\n`;
      md += `| Severity | File | Line | Explanation | Suggestion |\n`;
      md += `| :---: | :--- | :---: | :--- | :--- |\n`;
      
      issues.forEach(i => {
        const emoji = this.SEVERITY_EMOJI[i.severity];
        const fileName = i.file.split('/').pop() || i.file;
        // GitHub relative link (heuristic)
        const fileLink = `[\`${fileName}\`](${i.file})`;
        
        md += `| ${emoji} **${i.severity}** | ${fileLink} | \`${i.line}\` | ${i.explanation} | _${i.suggestion}_ |\n`;
      });
      md += `\n`;
    });

    md += `---\n`;
    md += `*Generated automatically by the Semantic Audit Suite. Quality is not an act, it is a habit.*`;

    return md;
  }

  private renderExecutiveSummary(stats: AuditStats): string {
    const status = stats.score >= 90 ? '✅ EXCELLENT' : stats.score >= 70 ? '⚠️ STABLE' : '🚨 CRITICAL';
    const date = new Date().toLocaleString();

    let summary = `## 📊 Executive Summary\n\n`;
    summary += `> **Audit Status:** ${status}\n`;
    summary += `> **Quality Score:** \`${stats.score}/100\`\n`;
    summary += `> **Timestamp:** ${date}\n\n`;
    
    return summary;
  }

  private renderTableOfContents(grouped: Map<string, AnalyzerIssue[]>): string {
    let toc = `### 📋 Contents\n\n`;
    toc += `- [Executive Summary](#-executive-summary)\n`;
    toc += `- [Project Metrics](#-project-metrics)\n`;
    toc += `- [Detailed Analysis](#-detailed-analysis)\n`;
    
    grouped.forEach((_, analyzer) => {
      const anchor = analyzer.toLowerCase().replace(/\s+/g, '-');
      toc += `  - [${analyzer}](#${anchor})\n`;
    });
    
    toc += `\n`;
    return toc;
  }

  private renderMetrics(stats: AuditStats): string {
    let metrics = `### 📈 Project Metrics\n\n`;
    metrics += `| Metric | Value | Status |\n`;
    metrics += `| :--- | :--- | :--- |\n`;
    metrics += `| Total Issues | **${stats.total}** | ${stats.total > 0 ? '🔍 Action required' : '✨ Clean build'} |\n`;
    metrics += `| Critical Violations | **${stats.criticals}** | ${stats.criticals > 0 ? '❌ Blocking' : '✅ Passed'} |\n`;
    metrics += `| Architectural Warnings | **${stats.warnings}** | ${stats.warnings > 0 ? '⚠️ Technical Debt' : '✅ Passed'} |\n`;
    metrics += `| Efficiency Suggestions | **${stats.suggestions}** | 🟢 Optimal |\n`;
    metrics += `| Analysis Duration | \`${stats.durationMs}ms\` | 🚀 High Performance |\n\n`;
    
    return metrics;
  }
}
