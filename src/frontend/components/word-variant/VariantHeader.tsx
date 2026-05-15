import { Volume2, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { VariantHeaderProps } from "./types";

const cefrColors: Record<string, string> = {
  A1: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  A2: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5",
  B1: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  B2: "text-blue-300 border-blue-500/20 bg-blue-500/5",
  C1: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  C2: "text-purple-300 border-purple-500/20 bg-purple-500/5",
};

export function VariantHeader({ variant, category, isExpanded, onToggle }: VariantHeaderProps) {
  const Icon = category.icon;

  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-6">
        <div className={clsx(
          "w-16 h-16 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
          category.color
        )}>
          <Icon size={28} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-white tracking-tight">
              {variant.word}
            </h3>
            <button className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
              <Volume2 size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-zinc-500">[{variant.pronunciation}]</span>
            <div className={clsx(
              "px-2 py-0.5 rounded-md text-sm font-black border",
              cefrColors[variant.cefr] || "text-zinc-500 border-zinc-800 bg-zinc-800/10"
            )}>
              {variant.cefr}
            </div>
            <span className="text-zinc-600 font-bold text-sm uppercase tracking-widest">•</span>
            <span className="text-emerald-500/80 font-bold text-sm uppercase tracking-widest">
              {variant.translation}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={onToggle}
        className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
          isExpanded ? "bg-white/10 text-white rotate-90" : "bg-white/5 text-zinc-500 hover:bg-white/10"
        )}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
