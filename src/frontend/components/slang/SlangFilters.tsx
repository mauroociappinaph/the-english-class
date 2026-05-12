"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FormalityLevel } from "@/shared/types/expression";
import { useSlangStore } from "@/frontend/store/useSlangStore";

const REGIONS = [
  { label: "🇺🇸 American", value: "American English" },
  { label: "🇬🇧 British", value: "British English" },
  { label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish", value: "Scottish English" },
  { label: "🇮🇪 Irish", value: "Irish English" },
  { label: "🇦🇺 Australian", value: "Australian English" },
  { label: "🇳🇿 New Zealand", value: "New Zealand English" },
  { label: "🇨🇦 Canadian", value: "Canadian English" },
  { label: "🇿🇦 South African", value: "South African English" },
  { label: "🇮🇳 Indian", value: "Indian English" },
  { label: "🇵🇭 Filipino", value: "Filipino English" },
  { label: "🇸🇬 Singlish", value: "Singapore English (Singlish)" },
  { label: "🇳🇬 Nigerian", value: "Nigerian English" },
  { label: "🇯🇲 Jamaican", value: "Jamaican English" },
];

const FORMALITY_OPTIONS: { label: string; value: FormalityLevel | null }[] = [
  { label: "All", value: null },
  { label: "Formal", value: "formal" },
  { label: "Neutral", value: "neutral" },
  { label: "Informal", value: "informal" },
  { label: "Slang", value: "slang" },
  { label: "Old-fashioned", value: "old-fashioned" },
];

interface SlangFiltersProps {
  availableRegions?: string[];
  totalResults: number;
}

export function SlangFilters({ availableRegions, totalResults }: SlangFiltersProps) {
  const {
    activeRegion,
    formalityFilter,
    showSlangOnly,
    compareMode,
    setRegionFilter,
    setFormalityFilter,
    setShowSlangOnly,
    toggleCompareMode,
    clearFilters,
  } = useSlangStore();

  const hasActiveFilters = activeRegion !== null || formalityFilter !== null || showSlangOnly;

  const visibleRegions = availableRegions
    ? REGIONS.filter((r) => availableRegions.includes(r.value))
    : REGIONS;

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
            {totalResults} variant{totalResults !== 1 ? "s" : ""}
          </span>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearFilters}
                className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-semibold hover:text-white hover:border-zinc-600 transition-all"
              >
                ✕ Clear filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {/* Slang only toggle */}
          <button
            onClick={() => setShowSlangOnly(!showSlangOnly)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
              showSlangOnly
                ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                : "bg-zinc-800/60 border-zinc-700 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            🔥 Slang only
          </button>

          {/* Compare mode */}
          <button
            onClick={toggleCompareMode}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
              compareMode
                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                : "bg-zinc-800/60 border-zinc-700 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            ⚡ Compare
          </button>
        </div>
      </div>

      {/* Compare instructions */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3">
              <p className="text-blue-300 text-xs font-medium">
                Select up to 2 variants to compare them side by side. Click the <strong>+</strong> button on each card.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRegionFilter(null)}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
            activeRegion === null
              ? "bg-white text-black border-white"
              : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
          }`}
        >
          All
        </button>
        {visibleRegions.map((region) => (
          <button
            key={region.value}
            onClick={() => setRegionFilter(activeRegion === region.value ? null : region.value)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
              activeRegion === region.value
                ? "bg-blue-500/30 border-blue-500/60 text-blue-200"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Formality filter */}
      <div className="flex flex-wrap gap-2">
        {FORMALITY_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setFormalityFilter(opt.value)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
              formalityFilter === opt.value
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
