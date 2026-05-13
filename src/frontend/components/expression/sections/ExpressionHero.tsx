"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SimilarWords } from "@/frontend/components/expression/SimilarWords";
import { getCefrStyle } from "@/frontend/components/cefr-styles";
import { ExpressionHeroProps, sectionVariants } from "./types";

const FORMALITY_BADGE: Record<string, { border: string; text: string }> = {
  formal: { border: "border-blue-500/30", text: "text-blue-300" },
  neutral: { border: "border-zinc-700", text: "text-zinc-400" },
  informal: { border: "border-amber-500/30", text: "text-amber-300" },
  slang: { border: "border-purple-500/30", text: "text-purple-300" },
  offensive: { border: "border-red-500/30", text: "text-red-400" },
  "old-fashioned": { border: "border-stone-500/30", text: "text-stone-400" },
};

export function ExpressionHero({ expressionId, analysis }: ExpressionHeroProps) {
  const slangData = analysis.linguistics?.slangData;
  const regionalVariants = slangData?.regionalVariants ?? [];
  const topVariant = regionalVariants[0] ?? null;
  const formalityKey = (analysis.metadata?.formality ?? "neutral").toLowerCase();
  const formalityStyle = FORMALITY_BADGE[formalityKey] ?? FORMALITY_BADGE.neutral;
  const cefrStyle = getCefrStyle(analysis.metadata.cefr);

  return (
    <motion.section
      id="hero"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-8 pt-8"
    >
      <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 block">
        {analysis.metadata.type}
      </span>

      <h1 className="font-display text-8xl md:text-[10rem] font-black tracking-tighter text-white leading-none">
        {analysis.text}
      </h1>

      <div className="flex items-center justify-center gap-6 flex-wrap">
        <p className="text-zinc-500 italic font-mono text-xl">{analysis.metadata.ipa}</p>
        <div className={`px-4 py-1.5 rounded-full border ${cefrStyle.bg} text-white text-xs font-black uppercase tracking-widest`}>
          {analysis.metadata.cefr}
        </div>
        {topVariant && (
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-bold">
            <span className="text-base">{topVariant.flag}</span>
            {topVariant.region}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${formalityStyle.border} ${formalityStyle.text}`}>
          {analysis.metadata.formality ?? "Neutral"}
        </span>
        {slangData?.isSlang && (
          <span className="px-3 py-1 rounded-full border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Slang · Level {slangData.detectedSlangLevel}/3
          </span>
        )}
        {regionalVariants.length > 0 && (
          <Link
            href={`/expression/${expressionId}/slang`}
            className="px-3 py-1 rounded-full border border-white/10 text-zinc-400 text-xs font-semibold hover:text-white hover:border-white/30 transition-all"
          >
            🌍 {regionalVariants.length} regional variants →
          </Link>
        )}
        <SimilarWords words={slangData?.similarWords ?? []} limit={3} />
      </div>
    </motion.section>
  );
}
