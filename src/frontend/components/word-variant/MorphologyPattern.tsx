import { Link as LinkIcon, Zap, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { MorphologyPatternProps } from "./types";
import { motion } from "framer-motion";

export function MorphologyPattern({ variant }: MorphologyPatternProps) {
  const { morphology } = variant;
  
  if (!morphology) return null;

  return (
    <div className="space-y-16 py-12">
      {/* Header with flair */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
            <LinkIcon size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white tracking-tight uppercase">Word Architecture</h4>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Morphology & DNA</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <Sparkles size={16} className="text-blue-500" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Structural Analysis</span>
        </div>
      </div>

      {/* DNA Visualization */}
      <div className="relative group">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Prefix */}
          <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 flex flex-col items-center text-center space-y-4 group/prefix hover:border-white/20 transition-all">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Initial Modifier</span>
            <div className="text-4xl font-black text-zinc-500 tracking-tighter group-hover/prefix:text-white transition-colors">
              {morphology.prefix || "—"}
            </div>
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-widest">Prefix</p>
          </div>

          {/* Root */}
          <div className="p-12 rounded-[4rem] bg-blue-500/5 border-2 border-blue-500/20 flex flex-col items-center text-center space-y-6 relative overflow-hidden group/root shadow-2xl shadow-blue-500/5">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={40} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Core Essence</span>
            <div className="text-5xl font-black text-blue-400 tracking-tighter scale-110">
              {morphology.root}
            </div>
            <p className="text-xs font-black text-blue-500/60 uppercase tracking-[0.4em]">The Root</p>
          </div>

          {/* Suffix */}
          <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 flex flex-col items-center text-center space-y-4 group/suffix hover:border-white/20 transition-all">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Functional Ending</span>
            <div className="text-4xl font-black text-zinc-500 tracking-tighter group-hover/suffix:text-white transition-colors">
              {morphology.suffix || "—"}
            </div>
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-widest">Suffix</p>
          </div>
        </div>
      </div>

      {/* Interaction Hint */}
      <div className="flex justify-center">
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
          Understanding the <span className="text-blue-500">Root</span> helps you predict the meaning of its family.
        </p>
      </div>
    </div>
  );
}
