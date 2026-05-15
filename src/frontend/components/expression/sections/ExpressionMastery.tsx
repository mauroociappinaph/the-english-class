"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { PitfallQuiz } from "@/frontend/components/expression/PitfallQuiz";
import { ExpressionMasteryProps, sectionVariants } from "./types";

export function ExpressionMastery({ usageTips, formality }: ExpressionMasteryProps) {
  return (
    <motion.section
      id="mastery"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className="space-y-10"
    >
      <div className="flex items-center gap-4">
        <GraduationCap size={20} className="text-zinc-600" />
        <h2 className="font-display text-lg font-black uppercase tracking-[0.4em] text-zinc-500">Mastery</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Naturalness */}
        {usageTips?.naturalness && (
          <div className="space-y-4 border border-white/5 rounded-2xl p-8 bg-white/[0.01]">
            <span className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 block">Naturalness</span>
            <p className="text-white text-2xl leading-relaxed font-medium">
              {usageTips.naturalness}
            </p>
          </div>
        )}

        {/* Common Mistake */}
        {usageTips?.commonMistake && (
          <div className="space-y-6 border border-white/5 rounded-2xl p-8 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <Sparkles size={14} className="text-amber-500/50" />
                <span className="text-sm font-black uppercase tracking-[0.4em]">Interactive Quiz</span>
              </div>
              <span className="text-sm font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase">Common Pitfall</span>
            </div>
            
            <PitfallQuiz mistake={usageTips.commonMistake} />
            
            {usageTips.context && (
              <p className="text-sm text-zinc-500 leading-relaxed pt-4 border-t border-white/5 italic">
                Context: {usageTips.context}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Formality + Frequency */}
      <div className="flex flex-wrap gap-12 pt-4">
        <div className="space-y-2">
          <span className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 block">Formality</span>
          <p className="font-display text-4xl font-black uppercase tracking-tighter text-white">{formality}</p>
        </div>
        <div className="space-y-4">
          <span className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 block">Frequency</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 w-10 rounded-full transition-all duration-700 ${i <= 4 ? "bg-white" : "bg-zinc-800"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
