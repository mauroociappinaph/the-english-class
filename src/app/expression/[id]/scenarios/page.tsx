"use client";
import { motion } from "framer-motion";
import { Terminal, Cpu, Layers, Activity, Share2 } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { InteractiveText } from "@/frontend/components/InteractiveText";

export default function ScenariosPage() {
  const { currentAnalysis } = useStudyStore();

  if (!currentAnalysis) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Page Header Header */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Cpu size={20} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Live Scenarios</h4>
            <p className="text-lg font-bold text-white">Simulation Modules</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end opacity-40">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Sim_Engine v2.0</span>
          <div className="flex gap-1 mt-1">
            <div className="w-1 h-1 rounded-full bg-blue-500/40" />
            <div className="w-1 h-1 rounded-full bg-blue-500/20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        {currentAnalysis.linguistics.examples?.map((ex: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex flex-col glass rounded-[3rem] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-700"
          >
            {/* Module Background Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative p-10 space-y-8 h-full flex flex-col">
              {/* Module Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <span className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-[0.2em] group-hover:text-blue-400 transition-colors">
                    MODULE_{(ex.category ?? 'scenario').toUpperCase().replace(/\s+/g, '_')}
                  </span>
                </div>
                <Terminal size={12} className="text-zinc-800 group-hover:text-blue-500/30 transition-colors" />
              </div>

              {/* Environment Specs */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {ex.tone && (
                    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">TONE:</span>
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">{ex.tone}</span>
                    </div>
                  )}
                  {ex.register && (
                    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">REG:</span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">{ex.register}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <InteractiveText 
                    text={ex.text} 
                    translation={ex.translation || ""} 
                    className="text-2xl text-white leading-tight font-bold tracking-tight block" 
                  />
                  
                  {ex.explanation && (
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-500/20" />
                      <p className="text-sm text-zinc-500 leading-relaxed font-medium italic">
                        {ex.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Adaptation Layers */}
              {(ex.literalTranslation || ex.subtitleAdaptation) && (
                <div className="mt-auto pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/5">
                  {ex.literalTranslation && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Share2 size={10} className="text-zinc-600" />
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">LITERAL_CORE</span>
                      </div>
                      <p className="text-xs text-zinc-400 italic leading-relaxed">"{ex.literalTranslation}"</p>
                    </div>
                  )}
                  {ex.subtitleAdaptation && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers size={10} className="text-zinc-600" />
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">SUB_ADAPTATION</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">"{ex.subtitleAdaptation}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Module Footer Footer */}
              <div className="pt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-mono text-zinc-700 uppercase">Status: Analysis_Verified</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-blue-500/20" />
                  <Activity size={8} className="text-blue-500/40" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
