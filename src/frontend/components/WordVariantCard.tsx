import { motion } from "framer-motion";
import { 
  Volume2, 
  ChevronRight, 
  Info, 
  Lightbulb, 
  AlertCircle, 
  Target, 
  Link as LinkIcon,
  BookOpen,
  ArrowRightLeft,
  LucideIcon
} from "lucide-react";
import { WordVariant } from "@/shared/types/expression";
import { useState } from "react";
import { clsx } from "clsx";
import { WordVariantCardProps } from "../types/components";
import { TagChip } from "./ui/TagChip";

export function WordVariantCard({ variant, category, index }: WordVariantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = category.icon;

  const cefrColors: Record<string, string> = {
    A1: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    A2: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5",
    B1: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    B2: "text-blue-300 border-blue-500/20 bg-blue-500/5",
    C1: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    C2: "text-purple-300 border-purple-500/20 bg-purple-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className={clsx(
        "relative overflow-hidden rounded-[2.5rem] border transition-all duration-500",
        isExpanded ? "bg-white/[0.03] border-white/10" : "bg-white/[0.01] border-white/5 hover:border-white/10"
      )}>
        {/* Progress Line */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color.split(' ')[2]} opacity-20`} />

        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Pos Icon */}
              <div className={clsx(
                "w-16 h-16 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                category.color
              )}>
                <Icon size={28} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    {variant.word}
                  </h3>
                  <button className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
                    <Volume2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-zinc-500">[{variant.pronunciation}]</span>
                  <div className={clsx(
                    "px-2 py-0.5 rounded-md text-[10px] font-black border",
                    cefrColors[variant.cefr] || "text-zinc-500 border-zinc-800 bg-zinc-800/10"
                  )}>
                    {variant.cefr}
                  </div>
                  <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">•</span>
                  <span className="text-emerald-500/80 font-bold text-xs uppercase tracking-widest">
                    {variant.translation}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                isExpanded ? "bg-white/10 text-white rotate-90" : "bg-white/5 text-zinc-500 hover:bg-white/10"
              )}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-[90%]">
            {variant.simpleExplanation}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {variant.naturalContexts?.slice(0, 2).map(ctx => (
                <span key={ctx} className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {ctx}
                </span>
              )) || null}
              {(variant.naturalContexts?.length || 0) > 2 && (
                <span className="text-[9px] font-bold text-zinc-700 flex items-center italic">
                  +{(variant.naturalContexts?.length || 0) - 2} more
                </span>
              )}
            </div>
            
            {!isExpanded && (
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-lg bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-zinc-600" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="mt-10 pt-10 border-t border-white/5 space-y-12">
              {/* Examples Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Examples in Action</h4>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">Natural usage scenarios</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variant.examples?.slice(0, 3).map((ex, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/ex">
                      <p className="text-white text-base font-medium italic leading-relaxed">
                        "{ex.text}"
                      </p>
                      <p className="mt-3 text-xs text-zinc-500 uppercase font-black tracking-widest group-hover/ex:text-emerald-500/70 transition-colors">
                        {ex.translation}
                      </p>
                    </div>
                  )) || (
                    <p className="text-zinc-600 text-xs italic">No examples available for this variant yet.</p>
                  )}
                </div>
              </div>

              {/* Advanced Mechanics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Info size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/50">Common Partners</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.commonCollocations?.map((coll: any) => (
                      <TagChip key={typeof coll === 'string' ? coll : coll.phrase || Math.random().toString()} variant="blue">
                        {typeof coll === 'string' ? coll : coll.phrase || coll.word || ""}
                      </TagChip>
                    )) || null}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <ArrowRightLeft size={14} className="text-purple-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400/50">Synonyms & Antonyms</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.synonyms?.slice(0, 3).map(syn => (
                      <TagChip key={syn} variant="purple">
                        {syn}
                      </TagChip>
                    )) || null}
                    {variant.antonyms?.slice(0, 2).map(ant => (
                      <TagChip key={ant} variant="zinc">
                        {ant}
                      </TagChip>
                    )) || null}
                  </div>
                </div>
              </div>

              {/* Morphology Patterns */}
              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/50 to-transparent border border-white/5 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <LinkIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Morphology Pattern</h4>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">Visual word relationships</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {variant.patterns?.map((p, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className={clsx(
                          "text-lg font-black transition-all",
                          p === variant.word ? "text-blue-400 scale-110" : "text-zinc-700"
                        )}>
                          {p}
                        </span>
                        {i < (variant.patterns?.length || 0) - 1 && (
                          <ChevronRight size={14} className="text-zinc-800" />
                        )}
                      </div>
                    )) || null}
                  </div>

                  <div className="grid grid-3 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Prefix</p>
                      <p className="text-sm font-bold text-white">{variant.morphology?.prefix || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Root</p>
                      <p className="text-sm font-bold text-blue-400">{variant.morphology?.root || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Suffix</p>
                      <p className="text-sm font-bold text-white">{variant.morphology?.suffix || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Insights / Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
                  <div className="flex items-center gap-3 text-blue-400">
                    <Info size={18} />
                    <h5 className="text-sm font-black uppercase tracking-widest">Grammar Note</h5>
                  </div>
                  <p className="text-xs text-blue-200/60 leading-relaxed italic">
                    {variant.grammarExplanation}
                  </p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Lightbulb size={18} />
                    <h5 className="text-sm font-black uppercase tracking-widest">Pro Tip</h5>
                  </div>
                  <div className="space-y-2">
                    {variant.tips?.map((tip, i) => (
                      <p key={i} className="text-xs text-amber-200/60 leading-relaxed flex gap-2">
                        <span className="text-amber-500">•</span> {tip}
                      </p>
                    )) || (
                      <p className="text-xs text-amber-200/40 italic">Focus on the root meaning for better recall.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Common Mistakes */}
              {variant.commonMistakes && (
                <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                  <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Watch out!</h5>
                    <p className="text-xs text-red-200/60 leading-relaxed italic">{variant.commonMistakes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
