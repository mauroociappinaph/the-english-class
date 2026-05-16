import { Volume2, ChevronRight, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import { clsx } from "clsx";
import { VariantHeaderProps } from "./types";

const cefrColors: Record<string, string> = {
  A1: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  A2: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5",
  B1: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  B2: "text-blue-300 border-blue-500/20 bg-blue-500/5",
  C1: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  C2: "text-purple-300 border-purple-500/20 bg-purple-500/5",
  NOT_CLASSIFIED: "text-zinc-500 border-zinc-800 bg-zinc-800/10",
  UNKNOWN: "text-zinc-500 border-zinc-800 bg-zinc-800/10",
};

export function VariantHeader({ variant, category, isExpanded, onToggle }: VariantHeaderProps) {
  const Icon = category.icon;

  const isFormal = variant.naturalContexts?.includes("formal") || variant.naturalContexts?.includes("business") || variant.naturalContexts?.includes("academic");
  const isSpoken = variant.naturalContexts?.includes("spoken") || variant.naturalContexts?.includes("casual conversation");

  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-6 md:gap-8">
        <div className={clsx(
          "w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl",
          category.color,
          isExpanded ? "scale-110 shadow-blue-500/10" : "group-hover:scale-105"
        )}>
          <Icon size={32} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
              {variant.word}
            </h3>
            <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all group/audio">
              <Volume2 size={20} className="group-hover/audio:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base font-mono text-zinc-500 tracking-wider">/{variant.pronunciation}/</span>
              <div className={clsx(
                "px-3 py-1 rounded-lg text-xs md:text-sm font-black border shadow-sm flex items-center gap-2",
                cefrColors[variant.cefr] || cefrColors.UNKNOWN
              )}>
                <span>{variant.cefr.replace('_', ' ')}</span>
                {variant.isAiEstimated && (
                  <span className="text-[8px] bg-white/10 px-1 rounded text-zinc-400">AI</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-700 font-bold">•</span>
              <span className="text-emerald-500 font-black text-sm md:text-base uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-md">
                {variant.translation}
              </span>
            </div>

            {/* Tone Badges */}
            <div className="flex items-center gap-2">
              {isSpoken && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <MessageSquare size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Spoken</span>
                </div>
              )}
              {isFormal && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Briefcase size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Formal</span>
                </div>
              )}
              {variant.naturalContexts?.includes("academic") && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <GraduationCap size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Academic</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onToggle}
        className={clsx(
          "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
          isExpanded ? "bg-white/10 text-white rotate-90" : "bg-white/5 text-zinc-500 hover:bg-white/10"
        )}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
