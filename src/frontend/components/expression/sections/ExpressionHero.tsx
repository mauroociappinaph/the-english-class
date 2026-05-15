"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SimilarWords } from "@/frontend/components/expression/SimilarWords";
import { getCefrStyle } from "@/frontend/components/cefr-styles";
import { InteractiveText } from "@/frontend/components/InteractiveText";
import { ExpressionHeroProps, sectionVariants } from "./types";

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
  slangData 
}: ExpressionHeroProps) {
  const regionalVariants = slangData?.regionalVariants ?? [];
  const topVariant = regionalVariants[0] ?? null;
  const formalityKey = (formality ?? "neutral").toLowerCase();
  const formalityStyle = FORMALITY_BADGE[formalityKey] ?? FORMALITY_BADGE.neutral;
  const cefrStyle = getCefrStyle(cefr);

  return (
    <motion.section
      id="hero"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-8 pt-8"
    >
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
