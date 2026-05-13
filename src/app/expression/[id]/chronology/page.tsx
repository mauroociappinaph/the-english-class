"use client";

import { useStudyStore } from "@/frontend/store/useStudyStore";
import { TenseTimeline } from "@/frontend/components/TenseTimeline";

export default function ChronologyPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <TenseTimeline tenses={currentAnalysis.linguistics.tenses} />
      
      <div className="mt-12 px-8 flex items-center justify-between opacity-40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-zinc-800" />
          <span className="text-[10px] font-mono tracking-widest uppercase">System Stability: Nominal</span>
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase">Encryption: Verified</span>
      </div>
    </div>
  );
}
