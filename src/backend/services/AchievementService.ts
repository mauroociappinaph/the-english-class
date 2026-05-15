import { IAchievementRepository } from "../domain/repositories/IAchievementRepository";
import { IExpressionRepository } from "../domain/repositories/IExpressionRepository";
import { CreateAchievementDto } from "../domain/types/achievement";

export class AchievementService {
  constructor(
    private achievementRepository: IAchievementRepository,
    private expressionRepository: IExpressionRepository
  ) {}

  /**
   * Evaluates if new achievements should be unlocked for the user.
   */
  async checkAchievements() {
    const expressions = await this.expressionRepository.findAll();
    const existingAchievements = await this.achievementRepository.findAll();
    const existingSlugs = new Set(existingAchievements.map((a) => a.slug));

    const newAchievements: CreateAchievementDto[] = [];

    // 1. CEFR Milestones
    const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (const level of cefrLevels) {
      const levelExpressions = expressions.filter((e) => e.metadata.cefr === level);
      const masteredInLevel = levelExpressions.filter((e) => e.study.status === 'mastered');

      // A1 Explorer: 5 words mastered
      if (level === 'A1' && masteredInLevel.length >= 5 && !existingSlugs.has('cefr-a1-explorer')) {
        newAchievements.push({
          slug: 'cefr-a1-explorer',
          title: 'A1 Explorer',
          description: 'Mastered 5 basic A1 expressions.',
          type: 'CEFR'
        });
      }

      // CEFR Master: 100% of analyzed words mastered (minimum 10 words)
      if (levelExpressions.length >= 10 && masteredInLevel.length === levelExpressions.length && !existingSlugs.has(`cefr-${level.toLowerCase()}-master`)) {
        newAchievements.push({
          slug: `cefr-${level.toLowerCase()}-master`,
          title: `${level} Master`,
          description: `Achieved 100% mastery of all analyzed ${level} content.`,
          type: 'CEFR'
        });
      }
    }

    // 2. Word Family Completion
    const familyCounts: Record<string, Set<string>> = {};
    
    expressions.forEach((e) => {
      if (e.linguistics.wordFamilies) {
        try {
          const root = e.text.toLowerCase(); // Simplified for now
          
          if (e.study.status === 'mastered') {
            if (!familyCounts[root]) familyCounts[root] = new Set();
            familyCounts[root].add(e.metadata.type);
          }
        } catch (err) {
          console.error("Failed to parse word families for achievement check", err);
        }
      }
    });

    // Morphology Novice: 1 full family (simplified check: at least 3 types mastered for same root)
    for (const [root, types] of Object.entries(familyCounts)) {
      if (types.size >= 3 && !existingSlugs.has('morphology-novice')) {
        newAchievements.push({
          slug: 'morphology-novice',
          title: 'Morphology Novice',
          description: 'Mastered 3 or more variants of a single word family.',
          type: 'FAMILY'
        });
      }
    }

    // 3. Linguistic Specialization
    const phrasalVerbs = expressions.filter((e) => e.metadata.type === 'phrasal_verb');
    const idioms = expressions.filter((e) => e.metadata.type === 'idiom');
    const slangs = expressions.filter((e) => e.metadata.formality === 'slang');

    // Master of Phrasal Verbs: 10 phrasal verbs analyzed
    if (phrasalVerbs.length >= 10 && !existingSlugs.has('phrasal-verb-master')) {
      newAchievements.push({
        slug: 'phrasal-verb-master',
        title: 'Master of Phrasal Verbs',
        description: 'Analyzed 10 different phrasal verbs and their structural logic.',
        type: 'LINGUISTIC'
      });
    }

    // Idiom Enthusiast: 10 idioms analyzed
    if (idioms.length >= 10 && !existingSlugs.has('idiom-enthusiast')) {
      newAchievements.push({
        slug: 'idiom-enthusiast',
        title: 'Idiom Enthusiast',
        description: 'Deeply explored 10 idiomatic expressions.',
        type: 'LINGUISTIC'
      });
    }

    // Slang Guru: 10 slang terms analyzed
    if (slangs.length >= 10 && !existingSlugs.has('slang-guru')) {
      newAchievements.push({
        slug: 'slang-guru',
        title: 'Slang Guru',
        description: 'Mastered the art of informal street English with 10 slang terms.',
        type: 'LINGUISTIC'
      });
    }

    // Persist new achievements
    const results = [];
    for (const achievement of newAchievements) {
      const created = await this.achievementRepository.create(achievement);
      results.push(created);
    }

    return results;
  }

  async getAchievements() {
    return this.achievementRepository.findAll();
  }
}
