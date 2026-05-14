"use client";

import { motion } from "framer-motion";
import { Expression } from "@/frontend/types/store";
import { useMemo } from "react";

interface MasteryHeatmapProps {
  expressions: Expression[];
}

export function MasteryHeatmap({ expressions }: { expressions: Expression[] }) {
  const stats = useMemo(() => {
    const mastered = expressions.filter(e => (e.study.timesStudied ?? 0) >= 5).length;
    const learning = expressions.filter(e => (e.study.timesStudied ?? 0) > 0 && (e.study.timesStudied ?? 0) < 5).length;
    const new_count = expressions.filter(e => (e.study.timesStudied ?? 0) === 0).length;
    
    return { mastered, learning, new_count, total: expressions.length };
  }, [expressions]);

  const getCellColor = (reps: number) => {
    if (reps === 0) return "bg-zinc-800/50";
    if (reps < 3) return "bg-blue-900/40";
    if (reps < 5) return "bg-blue-700/60";
    if (reps < 10) return "bg-blue-500/80";
    return "bg-blue-400";
  };

  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Mastery Heatmap</h4>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-blue-400" />
             <span className="text-[10px] font-bold text-zinc-400">Mastered</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-zinc-700" />
             <span className="text-[10px] font-bold text-zinc-400">New</span>
           </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-1.5">
        {expressions.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={`aspect-square rounded-[3px] ${getCellColor(exp.study.timesStudied ?? 0)} transition-colors cursor-help group relative`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
              {exp.text} • {exp.study.timesStudied ?? 0} reps
            </div>
          </motion.div>
        ))}
        
        {expressions.length === 0 && (
          <div className="col-span-full py-8 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-xs text-zinc-500 font-bold">No expressions analyzed yet</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-2xl font-black text-white">{stats.mastered}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Mastered</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black text-blue-400">{stats.learning}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Learning</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black text-zinc-600">{stats.new_count}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total New</p>
        </div>
      </div>
    </div>
  );
}
