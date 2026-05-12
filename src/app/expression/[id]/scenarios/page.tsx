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
            className="group flex flex-col justify-between space-y-6 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-700"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <span className="text-[11px] font-black uppercase text-zinc-600 tracking-[0.3em] group-hover:text-blue-400 transition-colors">
                    {ex.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {ex.tone && (
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20 flex items-center gap-1.5">
                    <span className="text-sm">🎭</span> {ex.tone}
                  </span>
                )}
                {ex.register && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="text-sm">🗣️</span> {ex.register}
                  </span>
                )}
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
            </div>

            {(ex.literalTranslation || ex.subtitleAdaptation) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5 mt-auto">
                {ex.literalTranslation && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-black block">Literal</span>
                    <p className="text-sm text-zinc-400 italic leading-relaxed">"{ex.literalTranslation}"</p>
                  </div>
                )}
                {ex.subtitleAdaptation && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-black block">Subtitles</span>
                    <p className="text-sm text-zinc-300 leading-relaxed">"{ex.subtitleAdaptation}"</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
