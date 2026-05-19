import { Link, Info, Check, X } from "lucide-react";
import { clsx } from "clsx";
import { TransitivityCardProps } from "@/frontend/types/components";
import { safeVal } from "@/frontend/utils/linguistics";

export function TransitivityCard({ details }: TransitivityCardProps) {
  const { verb, particle, transitive, transitiveExplanation } = details || {};

  return (
    <div className="space-y-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Link size={24} />
          </div>
          <h5 className="text-xl font-black text-white">1. Transitivity</h5>
        </div>
        <span className={clsx(
          "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
          transitive ? "bg-blue-500/20 text-blue-400 border border-blue-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"
        )}>
          {transitive ? "Needs an object" : "Standalone"}
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Info size={14} /> The Big Idea
          </p>
          <p className="text-zinc-300 leading-relaxed">
            {safeVal(transitiveExplanation) || (transitive 
              ? "This phrasal verb is a \"social\" verb. It needs a companion (an object) to make sense." 
              : "This verb is an \"independent\" verb. It doesn't need anyone else to complete the action.")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check size={14} />
            </div>
            <p className="text-sm font-medium text-emerald-100 italic">
              I {verb} {transitive ? "the topic " : ""}{particle}.
            </p>
          </div>
          {transitive && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                <X size={14} />
              </div>
              <p className="text-sm font-medium text-red-200 italic line-through opacity-60">
                I {verb} {particle}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
