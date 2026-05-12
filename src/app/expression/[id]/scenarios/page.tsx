"use client";

import { motion } from "framer-motion";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { InteractiveText } from "@/frontend/components/InteractiveText";

export default function ScenariosPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16">
      <div className="flex items-center gap-8">
        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500 whitespace-nowrap">Live Scenarios</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        {currentAnalysis.examples?.map((ex, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group space-y-6 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="text-[11px] font-black uppercase text-zinc-600 tracking-[0.3em] group-hover:text-blue-400 transition-colors">
                {ex.category}
              </span>
            </div>
            <div className="space-y-4">
              <InteractiveText 
                text={ex.text} 
                translation={ex.translation || ""} 
                className="text-2xl text-zinc-100 leading-tight font-bold tracking-tight" 
              />
              {ex.explanation && (
                <p className="text-sm text-zinc-500 leading-relaxed font-medium italic border-l-2 border-white/5 pl-6">
                  {ex.explanation}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
