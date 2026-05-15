import { Link as LinkIcon, ChevronRight, Zap } from "lucide-react";
import { clsx } from "clsx";
import { MorphologyPatternProps } from "./types";

export function MorphologyPattern({ variant }: MorphologyPatternProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
          <LinkIcon size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Word Architecture</h4>
          <p className="text-sm font-bold text-zinc-600 uppercase">Morphology & relationships</p>
        </div>
      </div>

      <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap size={120} className="text-purple-500" />
        </div>

        {/* The Connection Chain */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {variant.patterns?.map((p, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className={clsx(
                "px-6 py-3 rounded-2xl border transition-all duration-500 font-bold",
                p.toLowerCase() === variant.word.toLowerCase() 
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400 scale-110 shadow-lg shadow-blue-500/5" 
                  : "bg-white/5 border-white/10 text-zinc-400 opacity-60"
              )}>
                {p}
              </div>
              {i < (variant.patterns?.length || 0) - 1 && (
                <ChevronRight size={18} className="text-zinc-800" />
              )}
            </div>
          )) || (
            <p className="text-sm text-zinc-600 italic">No direct morphological relatives identified.</p>
          )}
        </div>

        {/* DNA / Breakout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-all">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Prefix</p>
            <p className="text-xl font-black text-white tracking-tight">{variant.morphology?.prefix || "—"}</p>
            <p className="text-[10px] text-zinc-500 italic">Initial modifier</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10 space-y-2 group hover:bg-blue-500/[0.05] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap size={24} className="text-blue-400" />
            </div>
            <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em]">Root Core</p>
            <p className="text-xl font-black text-blue-400 tracking-tight">{variant.morphology?.root || "—"}</p>
            <p className="text-[10px] text-blue-500/40 italic">The essence of the word</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-all">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Suffix</p>
            <p className="text-xl font-black text-white tracking-tight">{variant.morphology?.suffix || "—"}</p>
            <p className="text-[10px] text-zinc-500 italic">Functional ending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
