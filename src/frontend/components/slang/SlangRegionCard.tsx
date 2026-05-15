"use client";

import { motion } from "framer-motion";
import { SlangLevel } from "@/shared/types/expression";
import { SlangRegionCardProps } from "@/frontend/types/components";
import { useSlangStore } from "@/frontend/store/useSlangStore";

const FORMALITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  formal:         { bg: "bg-blue-500/20 border-blue-500/40",   text: "text-blue-300",   label: "Formal" },
  neutral:        { bg: "bg-zinc-500/20 border-zinc-500/40",   text: "text-zinc-400",   label: "Neutral" },
  informal:       { bg: "bg-amber-500/20 border-amber-500/40", text: "text-amber-300",  label: "Informal" },
  slang:          { bg: "bg-purple-500/20 border-purple-500/40", text: "text-purple-300", label: "Slang" },
  offensive:      { bg: "bg-red-500/20 border-red-500/40",     text: "text-red-400",    label: "Offensive" },
  "old-fashioned":{ bg: "bg-stone-500/20 border-stone-500/40", text: "text-stone-400",  label: "Old-fashioned" },
};

const TAG_COLORS: Record<string, string> = {
  slang:          "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  formal:         "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  offensive:      "bg-red-500/20 text-red-400 border border-red-500/30",
  "old-fashioned":"bg-stone-500/20 text-stone-400 border border-stone-500/30",
  "internet-slang":"bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  regional:       "bg-green-500/20 text-green-300 border border-green-500/30",
  colloquial:     "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  vulgar:         "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

import { speakText } from "@/frontend/utils/audio";
import { SlangLevelBar } from "./SlangLevelBar";

export function SlangRegionCard({ variant, isSelected, onSelect }: SlangRegionCardProps) {
  const { compareMode, compareVariants, setCompareVariant } = useSlangStore();
  const formalityStyle = FORMALITY_STYLES[variant.formality] ?? FORMALITY_STYLES.neutral;

  const isInCompare = compareVariants.includes(variant.region);
  const compareSlot = compareVariants[0] === variant.region ? 0 : compareVariants[1] === variant.region ? 1 : null;

  function handleCompareToggle() {
    if (compareSlot !== null) {
      setCompareVariant(compareSlot, null);
    } else if (compareVariants[0] === null) {
      setCompareVariant(0, variant.region);
    } else if (compareVariants[1] === null) {
      setCompareVariant(1, variant.region);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      onClick={onSelect}
      className={`relative rounded-2xl border bg-zinc-900/60 backdrop-blur-sm p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group ${
        isSelected ? "border-blue-500/60 shadow-[0_0_40px_rgba(59,130,246,0.2)]" : "border-zinc-800"
      } ${isInCompare ? "ring-1 ring-purple-500/50" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{variant.flag}</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{variant.region}</p>
            {variant.subregion && (
              <p className="text-zinc-500 text-sm font-medium mt-0.5">{variant.subregion}</p>
            )}
            <p className="text-zinc-600 text-sm uppercase tracking-widest mt-0.5">{variant.country}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TTS button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakText(variant.example, variant.audioLocale ?? "en-US");
            }}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-blue-500/30 border border-zinc-700 hover:border-blue-500/50 flex items-center justify-center transition-all text-zinc-400 hover:text-blue-300"
            title="Listen to pronunciation"
          >
            🔊
          </button>

          {/* Compare button */}
          {compareMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCompareToggle();
              }}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                isInCompare
                  ? "bg-purple-500/30 border-purple-500/60 text-purple-300"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300"
              }`}
              title={isInCompare ? "Remove from compare" : "Add to compare"}
            >
              {isInCompare ? `${compareSlot === 0 ? "A" : "B"}` : "+"}
            </button>
          )}
        </div>
      </div>

      {/* Word */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-black text-white">{variant.word}</span>
        {variant.ipa && (
          <span className="text-zinc-500 font-mono text-sm">{variant.ipa}</span>
        )}
        {variant.pronunciation && !variant.ipa && (
          <span className="text-zinc-600 text-sm italic">{variant.pronunciation}</span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold uppercase tracking-wider border ${formalityStyle.bg} ${formalityStyle.text}`}>
          {formalityStyle.label}
        </span>
        {variant.tags.map((tag) => (
          <span key={tag} className={`px-2 py-0.5 rounded-full text-sm font-semibold ${TAG_COLORS[tag] ?? ""}`}>
            #{tag}
          </span>
        ))}
      </div>

      {/* Slang level */}
      <SlangLevelBar level={variant.slangLevel} />

      {/* Cultural note */}
      <div className="border-t border-zinc-800 pt-3">
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Cultural note</p>
        <p className="text-zinc-300 text-sm leading-relaxed">{variant.culturalNote}</p>
      </div>

      {/* Usage context */}
      <div className="flex items-start gap-2">
        <span className="text-zinc-600 text-sm mt-0.5">📍</span>
        <p className="text-zinc-500 text-sm leading-relaxed">{variant.usageContext}</p>
      </div>

      {/* Example */}
      <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/50">
        <p className="text-white text-sm leading-relaxed italic">&ldquo;{variant.example}&rdquo;</p>
        <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">{variant.exampleTranslation}</p>
      </div>
    </motion.div>
  );
}
