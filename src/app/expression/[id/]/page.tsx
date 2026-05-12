"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { VisualCard } from "@/frontend/components/VisualCard";
import { PhrasalVerbDetails } from "@/frontend/components/PhrasalVerbDetails";
import { WordFamilyList } from "@/frontend/components/WordFamilyList";

export default function ExpressionOverview() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="flex flex-col items-center gap-24">
      {/* Primary Translation & Meaning */}
      <div className="max-w-3xl space-y-10 text-center">
        <div className="flex items-center justify-center gap-6 text-5xl md:text-6xl font-bold text-white">
          <Languages size={56} className="text-blue-500" />
          <span className="gradient-text tracking-tight">{currentAnalysis.translation}</span>
        </div>
        <p className="text-zinc-400 text-2xl leading-relaxed font-medium">
          {currentAnalysis.meaning}
        </p>
        {currentAnalysis.secondaryMeanings && currentAnalysis.secondaryMeanings.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {currentAnalysis.secondaryMeanings.map((m, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-500 font-medium italic">
                &ldquo;{m}&rdquo;
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visual Mnemonic Bubble */}
      <div className="w-full max-w-5xl">
        <VisualCard 
          mnemonic={currentAnalysis.mnemonic} 
          text={currentAnalysis.text} 
        />
      </div>

      {/* Linguistic Mechanics Section */}
      {(currentAnalysis.wordFamilies || currentAnalysis.phrasalVerbDetails) && (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5">
          {currentAnalysis.phrasalVerbDetails && (
            <div className="space-y-6">
              <PhrasalVerbDetails details={currentAnalysis.phrasalVerbDetails} />
            </div>
          )}
          {currentAnalysis.wordFamilies && (
            <div className="space-y-6">
              <WordFamilyList families={currentAnalysis.wordFamilies} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
