"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SimilarWords } from "@/frontend/components/expression/SimilarWords";
import { getCefrStyle } from "@/frontend/components/cefr-styles";
import { InteractiveText } from "@/frontend/components/InteractiveText";
import { ExpressionHeroProps, sectionVariants } from "./types";
import { AlertCircle, Sparkles } from "lucide-react";

const FORMALITY_BADGE: Record<string, { border: string; text: string }> = {
  formal: { border: "border-blue-500/30", text: "text-blue-300" },
  neutral: { border: "border-zinc-700", text: "text-zinc-400" },
  informal: { border: "border-amber-500/30", text: "text-amber-300" },
  slang: { border: "border-purple-500/30", text: "text-purple-300" },
  offensive: { border: "border-red-500/30", text: "text-red-400" },
  "old-fashioned": { border: "border-stone-500/30", text: "text-stone-400" },
};

export function ExpressionHero({ 
  expressionId, 
  text, 
  translation, 
  type, 
  cefr, 
  ipa, 
  formality, 
  slangData,
  correction
}: ExpressionHeroProps) {
  const regionalVariants = slangData?.regionalVariants ?? [];
  const topVariant = regionalVariants[0] ?? null;
  const formalityKey = (formality ?? "neutral").toLowerCase();
  const formalityStyle = FORMALITY_BADGE[formalityKey] ?? FORMALITY_BADGE.neutral;
  const cefrStyle = getCefrStyle(cefr);

  const hasCorrection = correction && !correction.isCorrect;

  return (
    <motion.section
      id="hero"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-8 pt-8"
    >
      {/* Intelligent Feedback Layer */}
      <AnimatePresence>
        {hasCorrection && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20 text-left relative overflow-hidden group mb-12"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle size={100} className="text-amber-400" />
            </div>

            <div className="flex items-start gap-6 relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10 flex-shrink-0">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h5 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/60">Correction Layer</h5>
                  <div className="h-px w-12 bg-amber-500/20" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-amber-500/40 uppercase tracking-widest">Suggested Correction</p>
                    <p className="text-2xl font-black text-white tracking-tight">
                      {correction.correctedText}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-sm text-zinc-300 leading-relaxed italic">
                      " {correction.explanation} "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="text-xs font-black uppercase tracking-[0.6em] text-zinc-500 block">
        {type}
      </span>

      <h1 className="font-display text-8xl md:text-[10rem] font-black tracking-tighter text-white leading-none">
        {text}
      </h1>

      <div className="py-4">
        <InteractiveText 
          text="How would you translate this?"
          translation={translation}
          label="Main Translation"
          className="text-4xl md:text-6xl font-black text-white italic tracking-tight cursor-pointer hover:text-blue-400 transition-colors"
        />
      </div>

      <div className="flex items-center justify-center gap-6 flex-wrap">
        <p className="text-zinc-500 italic font-mono text-xl">{ipa}</p>
        <div className={`px-4 py-1.5 rounded-lg border ${cefrStyle.bg} text-white text-sm font-black uppercase tracking-widest`}>
          {cefr}
        </div>
        {topVariant && (
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-bold">
            <span className="text-base">{topVariant.flag}</span>
            {topVariant.region}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className={`px-4 py-1.5 rounded-lg border text-sm font-bold uppercase tracking-wider ${formalityStyle.border} ${formalityStyle.text}`}>
          {formality ?? "Neutral"}
        </span>
        {slangData?.isSlang && (
          <span className="px-4 py-1.5 rounded-lg border border-purple-500/30 text-purple-300 text-sm font-bold uppercase tracking-wider">
            Slang · Level {slangData.detectedSlangLevel}/3
          </span>
        )}
        {regionalVariants.length > 0 && (
          <Link
            href={`/expression/${expressionId}/slang`}
            className="px-4 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-sm font-semibold hover:text-white hover:border-white/30 transition-all"
          >
            🌍 {regionalVariants.length} regional variants →
          </Link>
        )}
        <SimilarWords words={slangData?.similarWords ?? []} limit={3} />
      </div>
    </motion.section>
  );
}
