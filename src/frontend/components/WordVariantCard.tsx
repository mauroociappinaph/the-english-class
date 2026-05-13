"use client";

import { motion, AnimatePresence } from "framer-motion";
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
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          "relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 cursor-pointer",
          "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10",
          isExpanded ? "ring-2 ring-blue-500/20 bg-white/[0.04]" : ""
        )}
      >
        {/* Main Content (Always Visible) */}
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", category.color)}>
                <Icon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {variant.word}
                  </h3>
                  <span className={clsx("px-2 py-0.5 rounded-md text-[9px] font-black border tracking-tighter", cefrColors[variant.cefr] || "text-zinc-500 border-zinc-500/20")}>
                    {variant.cefr}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-zinc-500 italic">/{variant.pronunciation}/</span>
                  <button className="text-zinc-600 hover:text-white transition-colors">
                    <Volume2 size={14} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">
                {category.label}
              </span>
              <span className="text-sm font-bold text-zinc-400">
                {variant.translation}
              </span>
            </div>
          </div>

          <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-[90%]">
            {variant.simpleExplanation}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {variant.naturalContexts.slice(0, 2).map(ctx => (
                <span key={ctx} className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {ctx}
                </span>
              ))}
              {variant.naturalContexts.length > 2 && (
                <span className="text-[9px] font-bold text-zinc-700 flex items-center italic">
                  +{variant.naturalContexts.length - 2} more
                </span>
              )}
            </div>
            
            <motion.div 
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="text-zinc-600 group-hover:text-blue-400 transition-colors"
            >
              <ChevronRight size={20} />
            </motion.div>
          </div>
        </div>

        {/* Expanded Content (Details) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5 bg-black/20"
            >
              <div className="p-8 space-y-8">
                {/* Comparison/Difference */}
                {variant.differenceWithSimilar && (
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <ArrowRightLeft size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Wait, how is it different?</span>
                    </div>
                    <p className="text-sm text-zinc-300 italic">
                      {variant.differenceWithSimilar}
                    </p>
                  </div>
                )}

                {/* Examples */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <BookOpen size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Real-world examples</span>
                  </div>
                  <div className="space-y-3">
                    {variant.examples.map((ex, i) => (
                      <div key={i} className="pl-4 border-l-2 border-white/10 py-1">
                        <p className="text-sm font-bold text-white tracking-tight leading-snug">
                          "{ex.text}"
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {ex.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grammar & Collocations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Target size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Common Partners</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.commonCollocations.map(col => (
                        <span key={col} className="px-2 py-1 rounded bg-white/5 text-[11px] text-zinc-400">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Info size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Grammar Bit</span>
                    </div>
                    <p className="text-xs text-zinc-400 italic">
                      {variant.grammarExplanation}
                    </p>
                  </div>
                </div>

                {/* Morphology Pattern */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-emerald-400 mb-4">
                    <LinkIcon size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Morphology Pattern</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {variant.patterns.map((p, i) => (
                      <div key={p} className="flex items-center gap-3">
                        <span className={clsx(
                          "text-xs font-bold",
                          p === variant.word ? "text-white underline decoration-emerald-500 underline-offset-4" : "text-zinc-600"
                        )}>
                          {p}
                        </span>
                        {i < variant.patterns.length - 1 && (
                          <ChevronRight size={12} className="text-zinc-800" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes & Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-400/70">
                      <AlertCircle size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-400/50">Common Mistake</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {variant.commonMistakes}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400/70">
                      <Lightbulb size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-400/50">Pro Tip</span>
                    </div>
                    <ul className="space-y-1">
                      {variant.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Corner Label (only visible when not expanded) */}
      {!isExpanded && (
        <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <Icon size={120} />
        </div>
      )}
    </motion.div>
  );
}
