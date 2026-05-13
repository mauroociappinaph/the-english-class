"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useSlangStore } from "@/frontend/store/useSlangStore";
import { SlangFilters } from "@/frontend/components/slang/SlangFilters";
import { SlangRegionCard } from "@/frontend/components/slang/SlangRegionCard";
import { SlangComparePanel } from "@/frontend/components/slang/SlangComparePanel";
import { RegionalVariant } from "@/shared/types/expression";
import { SimilarWords } from "@/frontend/components/expression/SimilarWords";

function EmptySlang() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
    >
      <div className="text-6xl">🌍</div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">No regional variants yet</h3>
        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
          Regional variant data is generated when an expression is first analyzed.
          Try searching for this expression again to trigger the analysis.
        </p>
      </div>
    </motion.div>
  );
}

function SlangOverviewBadge({ variants }: { variants: RegionalVariant[] }) {
  const slangCount = variants.filter((v) => v.slangLevel >= 2).length;
  const regions = [...new Set(variants.map((v) => v.flag))].slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Variants</span>
        <span className="text-white font-bold text-lg">{variants.length}</span>
      </div>
      <div className="w-px h-5 bg-zinc-800" />
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Slang forms</span>
        <span className="text-purple-300 font-bold text-lg">{slangCount}</span>
      </div>
      <div className="w-px h-5 bg-zinc-800" />
      <div className="flex gap-1">
        {regions.map((flag, i) => (
          <span key={i} className="text-xl">{flag}</span>
        ))}
        {variants.length > 6 && (
          <span className="text-zinc-600 text-xs font-medium self-center ml-1">
            +{variants.length - 6} more
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function SlangPage() {
  const { currentAnalysis } = useStudyStore();
  const { activeRegion, formalityFilter, showSlangOnly } = useSlangStore();

  const slangData = currentAnalysis?.linguistics?.slangData;
  const allVariants: RegionalVariant[] = slangData?.regionalVariants ?? [];

  const filteredVariants = useMemo(() => {
    return allVariants.filter((v) => {
      if (activeRegion && v.region !== activeRegion) return false;
      if (formalityFilter && v.formality !== formalityFilter) return false;
      if (showSlangOnly && v.slangLevel < 2) return false;
      return true;
    });
  }, [allVariants, activeRegion, formalityFilter, showSlangOnly]);

  const availableRegions = useMemo(
    () => [...new Set(allVariants.map((v) => v.region))],
    [allVariants]
  );

  if (!slangData || allVariants.length === 0) {
    return <EmptySlang />;
  }

  return (
    <div className="w-full">
      {/* Global slang indicator */}
      {slangData.isSlang && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl w-fit"
        >
          <span className="text-purple-400 text-sm">🔥</span>
          <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">
            Slang expression
          </span>
          <span className="text-purple-500 text-xs">· Level {slangData.detectedSlangLevel}/3</span>
        </motion.div>
      )}

      <SimilarWords words={slangData.similarWords} />

      {/* Overview badges */}
      <SlangOverviewBadge variants={allVariants} />

      {/* Filters */}
      <SlangFilters
        availableRegions={availableRegions}
        totalResults={filteredVariants.length}
      />

      {/* Compare Panel */}
      <SlangComparePanel variants={allVariants} />

      {/* Cards grid */}
      <AnimatePresence mode="wait">
        {filteredVariants.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-zinc-600"
          >
            No variants match your filters.
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredVariants.map((variant) => (
              <SlangRegionCard
                key={`${variant.region}-${variant.subregion ?? ""}`}
                variant={variant}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
