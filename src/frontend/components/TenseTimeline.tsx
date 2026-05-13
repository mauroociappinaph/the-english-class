import { motion } from "framer-motion";
import { LucideIcon, Activity, Clock, Timer, FastForward, History } from "lucide-react";
import { InteractiveText } from "./InteractiveText";
import { TenseTimelineProps } from "@/frontend/types/components";

export function TenseTimeline({ tenses = {} }: TenseTimelineProps) {
  const tenseOrder = ["past", "present", "future"];
  
  const categories: Record<string, { key: string; text: string; translation: string }[]> = {
    past: [],
    present: [],
    future: []
  };

  Object.entries(tenses || {}).forEach(([key, data]) => {
    const k = key.toLowerCase();
    const tenseData = data as { text: string; translation: string };
    
    if (k.includes("past") || k.includes("used_to") || k.includes("would_past")) {
      categories.past.push({ key, ...tenseData });
    } else if (k.includes("future") || k.includes("conditional") || k.includes("reported")) {
      categories.future.push({ key, ...tenseData });
    } else {
      categories.present.push({ key, ...tenseData });
    }
  });

  const zoneLabels: Record<string, { label: string; icon: LucideIcon; color: string }> = {
    past: { label: "RETROSPECTIVE_ZONE", icon: History, color: "text-rose-400" },
    present: { label: "ACTIVE_FLOW", icon: Timer, color: "text-blue-400" },
    future: { label: "PROJECTION_ENGINE", icon: FastForward, color: "text-emerald-400" }
  };

  return (
    <div className="relative w-full glass rounded-[3rem] border border-white/10 overflow-hidden min-h-[600px]">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="relative p-12 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Temporal Analysis</h4>
              <p className="text-lg font-bold text-white">Chronological Assembly</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Chronos v4.1</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
              <div className="w-1 h-1 rounded-full bg-emerald-500/20" />
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative py-12">
          {/* Schematic Connection Line */}
          <div className="absolute top-[4.5rem] left-0 w-full h-px bg-zinc-800" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {tenseOrder.map((cat, idx) => {
              const ZoneIcon = zoneLabels[cat].icon;
              return (
                <div key={cat} className="space-y-8 group">
                  {/* Zone Header */}
                  <div className="flex flex-col items-center gap-4 relative">
                    <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-zinc-700 z-10 relative group-hover:border-emerald-500 transition-colors shadow-[0_0_15px_rgba(0,0,0,1)]" />
                    <div className="flex items-center gap-2">
                      <ZoneIcon size={12} className={zoneLabels[cat].color} />
                      <span className={`text-[10px] font-mono font-black tracking-[0.2em] uppercase ${zoneLabels[cat].color}`}>
                        {zoneLabels[cat].label}
                      </span>
                    </div>
                  </div>

                  {/* Tense Modules */}
                  <div className="space-y-4">
                    {categories[cat].map((tense, tIdx) => (
                      <motion.div 
                        key={tense.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (idx * 0.2) + (tIdx * 0.1) }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-3 group/module"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter group-hover/module:text-emerald-400 transition-colors">
                            MOD_{tense.key.toUpperCase()}
                          </span>
                          <Activity size={10} className="text-zinc-800 group-hover/module:text-emerald-500/30 transition-colors" />
                        </div>
                        <InteractiveText 
                          text={tense.text} 
                          translation={tense.translation} 
                          className="text-sm text-zinc-200 leading-relaxed font-bold block"
                        />
                      </motion.div>
                    ))}
                    {categories[cat].length === 0 && (
                      <div className="p-8 rounded-3xl border border-dashed border-white/5 flex flex-col items-center justify-center opacity-30">
                        <div className="w-1 h-1 rounded-full bg-zinc-700 mb-2" />
                        <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-600">No Data Detected</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Specs */}
        <div className="pt-12 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400/20 border border-rose-400/40" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Past Matrix</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400/20 border border-blue-400/40" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Current Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/40" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Future Vector</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/?tab=grammar'}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Access Full Grammar Atlas
            <FastForward size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
