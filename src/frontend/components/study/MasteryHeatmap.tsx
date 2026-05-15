"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Expression } from "@/frontend/types/store";
import { useMemo } from "react";
import { Bell, Zap, ArrowRight, Brain } from "lucide-react";

interface MasteryHeatmapProps {
  expressions: Expression[];
}

export function MasteryHeatmap({ expressions }: { expressions: Expression[] }) {
  const learningPhrases = useMemo(() => {
    return expressions
      .filter(e => (e.study.timesStudied ?? 0) > 0 && (e.study.timesStudied ?? 0) < 5)
      .sort((a, b) => (a.study.timesStudied ?? 0) - (b.study.timesStudied ?? 0));
  }, [expressions]);

  const stats = useMemo(() => {
    const mastered = expressions.filter(e => (e.study.timesStudied ?? 0) >= 5).length;
    const learning = learningPhrases.length;
    const new_count = expressions.filter(e => (e.study.timesStudied ?? 0) === 0).length;
    
    return { mastered, learning, new_count, total: expressions.length };
  }, [expressions, learningPhrases]);

  const getCellColor = (reps: number) => {
    if (reps === 0) return "bg-zinc-800/50";
    if (reps < 3) return "bg-blue-900/40";
    if (reps < 5) return "bg-blue-700/60";
    if (reps < 10) return "bg-blue-500/80";
    return "bg-blue-400";
  };

  return (
    <div className="w-full space-y-6">
      {/* SRS Notification Banner */}
      <AnimatePresence>
        {learningPhrases.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain size={80} className="text-blue-400" />
            </div>
            
            <div className="flex items-center gap-5 relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                <Bell size={28} className="animate-swing" />
              </div>
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60">Spaced Repetition</h5>
                <p className="text-lg font-black text-white tracking-tight">
                  Tienes {learningPhrases.length} frases en fase crítica de olvido.
                </p>
                <p className="text-xs text-zinc-400 font-medium">
                  Repasalas ahora para fortalecer las conexiones neuronales.
                </p>
              </div>
            </div>

            <button className="px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 group/btn">
              <Zap size={16} />
              Review Learning Stack
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Mastery Heatmap</h4>
            <p className="text-2xl font-black text-white italic tracking-tighter">Knowledge Density</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mastered</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/10" />
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">New</span>
             </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className="relative group/grid">
          <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2 relative">
            {expressions.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`aspect-square rounded-[4px] ${getCellColor(exp.study.timesStudied ?? 0)} transition-all duration-500 cursor-help group/cell relative hover:scale-125 hover:z-20 shadow-lg`}
              >
                {/* Visual indicator for "Learning" state */}
                {(exp.study.timesStudied ?? 0) > 0 && (exp.study.timesStudied ?? 0) < 5 && (
                  <div className="absolute inset-0 border border-blue-400/30 rounded-[4px] animate-pulse" />
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-zinc-950 border border-white/10 rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover/cell:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl translate-y-2 group-hover/cell:translate-y-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-500 uppercase tracking-tighter">Phrase Analysis</span>
                    <span className="text-white text-xs">{exp.text}</span>
                    <div className="h-px bg-white/5 my-1" />
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-blue-400">{exp.study.timesStudied ?? 0} Repetitions</span>
                      <span className="text-zinc-600 uppercase italic">{(exp.study.timesStudied ?? 0) >= 5 ? 'Mastered' : 'Learning'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {expressions.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                <p className="text-sm text-zinc-600 font-bold tracking-widest uppercase">No expressions analyzed in this sector</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-4xl font-black text-white italic tracking-tighter">{stats.mastered}</p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Synaptic Stability</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-blue-500/[0.03] border border-blue-500/10 space-y-2">
            <p className="text-4xl font-black text-blue-400 italic tracking-tighter">{stats.learning}</p>
            <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em]">Active Consolidation</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-4xl font-black text-zinc-600 italic tracking-tighter">{stats.new_count}</p>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Unexplored Modules</p>
          </div>
        </div>
      </div>
    </div>
  );
}

