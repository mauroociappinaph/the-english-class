import { Issue, Severity, ScoreBreakdown } from '../types/analyzer.types';

export class QualityScoreCalculator {

  private readonly WEIGHTS: Record<string, Record<Severity, number>> = {
    'CircularDepsAnalyzer': { HIGH: 15, MEDIUM: 8, LOW: 2 },
    'CouplingMetricsAnalyzer': { HIGH: 12, MEDIUM: 6, LOW: 2 },
    'AnyUsageAnalyzer': { HIGH: 10, MEDIUM: 3, LOW: 1 },
    'GiantInterfacesAnalyzer': { HIGH: 8, MEDIUM: 4, LOW: 1 },
    'UnusedTypesAnalyzer': { HIGH: 5, MEDIUM: 2, LOW: 1 },
    'InterfaceLocationAnalyzer': { HIGH: 5, MEDIUM: 3, LOW: 1 },
    'NamingConventionAnalyzer': { HIGH: 3, MEDIUM: 2, LOW: 1 }
  };

  public calculate(issues: Issue[]): ScoreBreakdown {
    let typeSafetyPenalty = 0;
    let architecturePenalty = 0;
    let maintainabilityPenalty = 0;

    issues.forEach(issue => {
      const penalty = this.getPenalty(issue);

      switch (issue.analyzer) {
        case 'AnyUsageAnalyzer':
          typeSafetyPenalty += penalty;
          break;
        case 'CircularDepsAnalyzer':
        case 'CouplingMetricsAnalyzer':
        case 'InterfaceLocationAnalyzer':
          architecturePenalty += penalty;
          break;
        case 'GiantInterfacesAnalyzer':
        case 'UnusedTypesAnalyzer':
        case 'NamingConventionAnalyzer':
        case 'NamingIntegrityAnalyzer':
        case 'LayerIntegrityAnalyzer':
          maintainabilityPenalty += penalty;
          break;
        default:
          maintainabilityPenalty += penalty;
      }
    });

    const typeSafetyScore = Math.max(0, 100 - typeSafetyPenalty);
    const architectureScore = Math.max(0, 100 - architecturePenalty);
    const maintainabilityScore = Math.max(0, 100 - maintainabilityPenalty);

    // Global Score: Weighted average
    // Architecture (40%), Type Safety (30%), Maintainability (30%)
    const total = Math.round(
      (architectureScore * 0.4) + 
      (typeSafetyScore * 0.3) + 
      (maintainabilityScore * 0.3)
    );

    return {
      typeSafety: typeSafetyScore,
      architecture: architectureScore,
      maintainability: maintainabilityScore,
      total
    };
  }

  private getPenalty(issue: Issue): number {
    const analyzerWeights = this.WEIGHTS[issue.analyzer];
    if (!analyzerWeights) {
      // Default penalties if analyzer not mapped
      return issue.severity === 'HIGH' ? 10 : issue.severity === 'MEDIUM' ? 5 : 1;
    }
    return analyzerWeights[issue.severity];
  }
}
