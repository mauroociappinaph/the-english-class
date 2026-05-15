"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Target, 
  TrendingUp,
  Volume2,
  ChevronRight,
  Gauge,
  Sparkles,
  Info,
  Brain
} from "lucide-react";
import { PhrasalVerbDetailsProps } from "../../types/components";
import { clsx } from "clsx";

import { useState } from "react";

export function CollocationMap({ details }: PhrasalVerbDetailsProps) {
  const { collocations } = details || {};
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!collocations || collocations.length === 0) return null;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Common Partners</h4>
            <p className="text-xl font-bold text-white">Collocation Network</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">High Naturalness</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Frequency Data</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {collocations.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={clsx(
              "group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500",
              expandedId === i && "border-blue-500/30 bg-blue-500/[0.03]"
            )}
          >
            {/* ... frequency bar ... */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={12} className={clsx(
                  item.frequency === 'high' ? "text-blue-400" : item.frequency === 'medium' ? "text-amber-400" : "text-zinc-500"
                )} />
                <span className={clsx(
                  "text-[9px] font-black uppercase tracking-widest",
                  item.frequency === 'high' ? "text-blue-400/80" : "text-zinc-600"
                )}>
                  {item.frequency} Frequency
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">Match</div>
                <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.naturalness || 0}%` }}
                    viewport={{ once: true }}
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      (item.naturalness || 0) > 80 ? "bg-emerald-500/60" : "bg-blue-500/60"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-2xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  &ldquo;{item.phrase}&rdquo;
                </h5>
                <button className="p-2 rounded-full hover:bg-white/5 text-zinc-600 hover:text-white transition-colors">
                  <Volume2 size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  {item.usageContext}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">
                  {item.translation}
                </span>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Target size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Example</span>
                </div>
                <p className="text-sm text-zinc-300 font-medium italic leading-relaxed">
                  "{item.example}"
                </p>
              </div>

              {/* Expanded Insight Section */}
              <AnimatePresence>
                {expandedId === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-4"
                  >
                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Brain size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Deep Insight</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                        {item.usageNote || `In ${item.usageContext} contexts, this collocation is favored for its high naturalness score (${item.naturalness}%). It represents a fixed semantic unit in native speaker production.`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Info */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase text-blue-400/60 tracking-widest">Usage Score: {item.naturalness}/100</span>
              </div>
              <button 
                onClick={() => setExpandedId(expandedId === i ? null : i)}
                className={clsx(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  expandedId === i ? "text-blue-400" : "text-zinc-600 hover:text-white"
                )}
              >
                {expandedId === i ? "Hide" : "Details"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
