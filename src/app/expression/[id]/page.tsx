"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { useParams } from "next/navigation";
import { VisualCard } from "@/frontend/components/VisualCard";
import { SimilarWords } from "@/frontend/components/expression/SimilarWords";

const FORMALITY_BADGE: Record<string, { bg: string; text: string }> = {
  formal:          { bg: "bg-blue-500/20 border-blue-500/40",   text: "text-blue-300" },
  neutral:         { bg: "bg-zinc-700/40 border-zinc-600/40",   text: "text-zinc-400" },
  informal:        { bg: "bg-amber-500/20 border-amber-500/40", text: "text-amber-300" },
  slang:           { bg: "bg-purple-500/20 border-purple-500/40", text: "text-purple-300" },
  offensive:       { bg: "bg-red-500/20 border-red-500/40",     text: "text-red-400" },
  "old-fashioned": { bg: "bg-stone-500/20 border-stone-500/40", text: "text-stone-400" },
};

export default function ExpressionOverview() {
  const { currentAnalysis } = useStudyStore();
  const params = useParams();
  const id = params.id as string;

  if (!currentAnalysis || !currentAnalysis.metadata || !currentAnalysis.linguistics) return null;

  const slangData = currentAnalysis?.linguistics?.slangData;
  const topVariant = slangData?.regionalVariants?.[0] ?? null;
  const formalityKey = (currentAnalysis?.metadata?.formality ?? "neutral").toLowerCase();
  const formalityStyle = FORMALITY_BADGE[formalityKey] ?? FORMALITY_BADGE.neutral;

  return (
    <div className="flex flex-col items-center gap-24">
      <div className="max-w-3xl space-y-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-6 text-5xl md:text-6xl font-bold text-white">
            <Languages size={56} className="text-blue-500" />
            <span className="gradient-text tracking-tight">{currentAnalysis.translation}</span>
          </div>
          
          {topVariant && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-zinc-400 text-sm font-bold tracking-wide uppercase">
              <span className="text-lg">{topVariant.flag}</span>
              <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                {topVariant.region}
              </span>
            </div>
          )}
        </div>

        <p className="text-zinc-400 text-2xl leading-relaxed font-medium">
          {currentAnalysis.meaning}
        </p>

        {currentAnalysis.metadata.secondaryMeanings && currentAnalysis.metadata.secondaryMeanings.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {currentAnalysis.metadata.secondaryMeanings.map((m: string, i: number) => (
              <span key={i} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-500 font-medium italic">
                &ldquo;{m}&rdquo;
              </span>
            ))}
          </div>
        )}

        {/* Regional metadata strip */}
        {slangData && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Slang badge */}
            {slangData.isSlang && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                🔥 Slang · Level {slangData.detectedSlangLevel}/3
              </span>
            )}

            {/* Formality badge */}
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${formalityStyle.bg} ${formalityStyle.text}`}>
              {currentAnalysis.metadata.formality ?? "Neutral"}
            </span>

            {/* Regions count + link */}
            {slangData.regionalVariants?.length > 0 && (
              <Link
                href={`/expression/${id}/slang`}
                className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all"
              >
                🌍 {slangData.regionalVariants.length} regional variants →
              </Link>
            )}

            <SimilarWords words={slangData.similarWords} limit={3} />
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl">
        <VisualCard 
          mnemonic={currentAnalysis.metadata.mnemonic} 
          text={currentAnalysis.text} 
        />
      </div>
    </div>
  );
}
