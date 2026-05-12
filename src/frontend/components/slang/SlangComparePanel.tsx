"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RegionalVariant } from "@/shared/types/expression";
import { useSlangStore } from "@/frontend/store/useSlangStore";

interface SlangComparePanelProps {
  variants: RegionalVariant[];
}

function speakText(text: string, locale: string = "en-US") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

interface CompareColumnProps {
  variant: RegionalVariant;
  slot: 0 | 1;
}

function CompareColumn({ variant, slot }: CompareColumnProps) {
  const { setCompareVariant } = useSlangStore();
  const accentColor = slot === 0 ? "blue" : "purple";

  return (
    <div className={`flex-1 rounded-2xl border bg-zinc-900/60 p-5 flex flex-col gap-4 border-${accentColor}-500/40`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl">{variant.flag}</span>
          <div>
            <p className="text-white font-bold text-sm">{variant.region}</p>
            {variant.subregion && (
              <p className={`text-${accentColor}-400 text-[11px] font-medium`}>{variant.subregion}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => speakText(variant.example, variant.audioLocale ?? "en-US")}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-blue-500/20 border border-zinc-700 text-xs flex items-center justify-center transition-all"
            title="Listen"
          >
            🔊
          </button>
          <button
            onClick={() => setCompareVariant(slot, null)}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 text-zinc-500 hover:text-red-400 text-xs flex items-center justify-center transition-all"
            title="Remove"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Word + IPA */}
      <div className="text-center py-3 border-y border-zinc-800">
        <p className={`text-3xl font-black text-${accentColor}-300`}>{variant.word}</p>
        {variant.ipa && (
          <p className="text-zinc-500 font-mono text-sm mt-1">{variant.ipa}</p>
        )}
      </div>

      {/* Metadata rows */}
      {[
        { label: "Formality",  value: variant.formality },
        { label: "Slang level", value: `${variant.slangLevel} / 3` },
        { label: "Context",    value: variant.usageContext },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</span>
          <span className="text-zinc-300 text-sm">{value}</span>
        </div>
      ))}

      {/* Cultural note */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 block mb-1">Cultural note</span>
        <p className="text-zinc-400 text-sm leading-relaxed">{variant.culturalNote}</p>
      </div>

      {/* Example */}
      <div className={`bg-${accentColor}-500/5 border border-${accentColor}-500/20 rounded-xl p-3`}>
        <p className="text-white text-sm italic">&ldquo;{variant.example}&rdquo;</p>
        <p className="text-zinc-500 text-xs mt-1.5">{variant.exampleTranslation}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {variant.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400 text-[10px] font-semibold">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SlangComparePanel({ variants }: SlangComparePanelProps) {
  const { compareMode, compareVariants } = useSlangStore();

  const variantA = compareVariants[0] ? variants.find((v) => v.region === compareVariants[0]) : null;
  const variantB = compareVariants[1] ? variants.find((v) => v.region === compareVariants[1]) : null;

  if (!compareMode || (!variantA && !variantB)) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full mb-10"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">Comparison Mode</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-purple-500/30 to-transparent" />
        </div>

        {/* Columns */}
        <div className="flex gap-4">
          {variantA ? (
            <CompareColumn variant={variantA} slot={0} />
          ) : (
            <div className="flex-1 rounded-2xl border border-dashed border-blue-500/20 flex items-center justify-center py-12 text-zinc-600 text-sm">
              Select variant A
            </div>
          )}
          {variantB ? (
            <CompareColumn variant={variantB} slot={1} />
          ) : (
            <div className="flex-1 rounded-2xl border border-dashed border-purple-500/20 flex items-center justify-center py-12 text-zinc-600 text-sm">
              Select variant B
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
