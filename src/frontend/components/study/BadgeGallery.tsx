import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Sparkles, ShieldCheck, Zap, Globe, Flame, GitMerge, MessageSquare } from 'lucide-react';
import { useAchievementStore } from '@/frontend/store/useAchievementStore';

const BADGE_DEFINITIONS = [
  { slug: 'cefr-a1-explorer', title: 'A1 Explorer', icon: Globe, color: 'from-orange-500 to-rose-500', description: 'Mastered 5 basic A1 expressions' },
  { slug: 'cefr-a1-master', title: 'A1 Master', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500', description: '100% mastery of A1 content' },
  { slug: 'cefr-a2-master', title: 'A2 Master', icon: ShieldCheck, color: 'from-blue-500 to-indigo-500', description: '100% mastery of A2 content' },
  { slug: 'phrasal-verb-master', title: 'Phrasal Master', icon: GitMerge, color: 'from-blue-600 to-cyan-500', description: 'Analyzed 10 phrasal verbs' },
  { slug: 'idiom-enthusiast', title: 'Idiom Expert', icon: MessageSquare, color: 'from-indigo-600 to-purple-500', description: 'Explored 10 idioms' },
  { slug: 'morphology-novice', title: 'Morphology Novice', icon: Zap, color: 'from-purple-500 to-pink-500', description: 'Mastered 3 variants of a word family' },
  { slug: 'consistency-streak', title: 'Consistency King', icon: Sparkles, color: 'from-amber-500 to-yellow-500', description: 'Study streak milestone' },
];

export const BadgeGallery: React.FC = () => {
  const { achievements: unlockedAchievements } = useAchievementStore();
  const unlockedSlugs = new Set(unlockedAchievements.map(a => a.slug));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white leading-tight">Achievement Gallery</h3>
            <p className="text-sm font-mono text-white/30 uppercase tracking-[0.2em]">Linguistic_Mastery_Records</p>
          </div>
        </div>
        <div className="text-sm font-bold text-white/40">
          {unlockedSlugs.size} / {BADGE_DEFINITIONS.length} Unlocked
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BADGE_DEFINITIONS.map((badge, index) => {
          const isUnlocked = unlockedSlugs.has(badge.slug);
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-[2rem] border transition-all duration-500 group overflow-hidden ${
                isUnlocked 
                  ? `bg-zinc-900/50 border-white/10 hover:border-white/20 shadow-xl shadow-black/50` 
                  : 'bg-zinc-950/20 border-white/5 opacity-40 grayscale'
              }`}
            >
              {/* Background Ambient Glow for unlocked badges */}
              {isUnlocked && (
                <div className={`absolute -top-12 -right-12 w-24 h-24 blur-[40px] opacity-20 rounded-full bg-gradient-to-br ${badge.color}`} />
              )}

              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className={`p-4 rounded-2xl border transition-transform duration-500 group-hover:scale-110 ${
                  isUnlocked 
                    ? `bg-white/5 border-white/10 text-white` 
                    : 'bg-black/20 border-white/5 text-white/20'
                }`}>
                  {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <h4 className={`text-sm font-black uppercase tracking-wider ${isUnlocked ? 'text-white' : 'text-white/20'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-sm text-white/40 leading-tight">
                    {badge.description}
                  </p>
                </div>

                {/* Progress Mini-Indicator (Mocked for now) */}
                {!isUnlocked && (
                  <div className="w-full mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-white/10" />
                  </div>
                )}
              </div>

              {/* Shine effect for unlocked badges */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
