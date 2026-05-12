"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { TenseTimeline } from "@/frontend/components/TenseTimeline";

export default function ChronologyPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16">
      <div className="flex items-center gap-8">
        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500 whitespace-nowrap">Chronological Context</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
      </div>
      <TenseTimeline tenses={currentAnalysis.tenses} />
      
      <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center mt-20">
        <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mx-auto">
          Understanding the temporal flow of an expression helps you visualize how it adapts to different timeframes. 
          The timeline above shows the most common verbal forms for this specific structure.
        </p>
      </div>
    </div>
  );
}
