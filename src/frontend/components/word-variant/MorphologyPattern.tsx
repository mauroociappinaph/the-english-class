import { Link as LinkIcon, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { MorphologyPatternProps } from "./types";

export function MorphologyPattern({ variant }: MorphologyPatternProps) {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/50 to-transparent border border-white/5 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <LinkIcon size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Morphology Pattern</h4>
            <p className="text-[9px] font-bold text-zinc-600 uppercase">Visual word relationships</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {variant.patterns?.map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className={clsx(
                "text-lg font-black transition-all",
                p === variant.word ? "text-blue-400 scale-110" : "text-zinc-700"
              )}>
                {p}
              </span>
              {i < (variant.patterns?.length || 0) - 1 && (
                <ChevronRight size={14} className="text-zinc-800" />
              )}
            </div>
          )) || null}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Prefix</p>
            <p className="text-sm font-bold text-white">{variant.morphology?.prefix || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Root</p>
            <p className="text-sm font-bold text-blue-400">{variant.morphology?.root || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Suffix</p>
            <p className="text-sm font-bold text-white">{variant.morphology?.suffix || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
