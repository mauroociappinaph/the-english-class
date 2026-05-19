"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  BookOpen, 
  AlertTriangle, 
  Info,
  CheckCircle2
} from "lucide-react";
import { WordVariant } from "@/shared/types/expression";
import { NuanceDeepDiveModalProps } from "@/frontend/types/components";

export function NuanceDeepDiveModal({ isOpen, variant, onClose }: NuanceDeepDiveModalProps) {
  if (!variant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Top ambient color glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5 relative z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sparkles size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-black text-white tracking-tight leading-none">
                      {variant.word}
                    </h3>
                    <div className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase">
                      {variant.cefr}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-zinc-500 font-mono mt-2">
                    {variant.pronunciation} &bull; {variant.translation}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 relative z-10 custom-scrollbar">
              
              {/* Introduction / Quick Explanation */}
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Pedagogical Concept</span>
                <p className="text-lg text-zinc-300 font-medium leading-relaxed">
                  {variant.simpleExplanation}
                </p>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Nuances & Grammar */}
                <div className="space-y-8">
                  {/* Contrast / Difference with similar words */}
                  {variant.differenceWithSimilar && (
                    <div className="p-8 rounded-[2rem] bg-blue-500/[0.02] border border-blue-500/10 space-y-4">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Info size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Contrast & Nuances</span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {variant.differenceWithSimilar}
                      </p>
                    </div>
                  )}

                  {/* Grammar Explanation */}
                  {variant.grammarExplanation && (
                    <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-4">
                      <div className="flex items-center gap-2 text-purple-400">
                        <BookOpen size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Grammar Anatomy</span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {variant.grammarExplanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Mistakes & Contexts */}
                <div className="space-y-8">
                  {/* Common Mistakes */}
                  {variant.commonMistakes && (
                    <div className="p-8 rounded-[2rem] bg-red-500/[0.02] border border-red-500/10 space-y-4">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Common Pitfall</span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                        {variant.commonMistakes}
                      </p>
                    </div>
                  )}

                  {/* Tips & Tricks */}
                  {variant.tips && variant.tips.length > 0 && (
                    <div className="p-8 rounded-[2rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Usage Strategy</span>
                      </div>
                      <ul className="space-y-3">
                        {variant.tips.map((tip, idx) => (
                          <li key={idx} className="flex gap-3 text-zinc-300 text-sm font-medium">
                            <Sparkles size={14} className="text-emerald-400 shrink-0 mt-1" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Row: Additional Details (Synonyms, Antonyms, Expressions) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                {/* Synonyms */}
                {variant.synonyms && variant.synonyms.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Synonyms</span>
                    <div className="flex flex-wrap gap-2">
                      {variant.synonyms.map((syn, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-300">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Antonyms */}
                {variant.antonyms && variant.antonyms.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Antonyms</span>
                    <div className="flex flex-wrap gap-2">
                      {variant.antonyms.map((ant, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-400">
                          {ant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Expressions */}
                {variant.commonExpressions && variant.commonExpressions.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Idioms & Expressions</span>
                    <div className="space-y-2">
                      {variant.commonExpressions.map((expr, i) => (
                        <div key={i} className="text-xs text-zinc-300 font-bold border-l-2 border-blue-500/40 pl-3 py-0.5">
                          {expr}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
