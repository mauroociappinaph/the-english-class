import { Split, Info, Check } from "lucide-react";
import { clsx } from "clsx";
import { SeparabilityCardProps } from "@/frontend/types/components";
import { safeVal } from "@/frontend/utils/linguistics";

export function SeparabilityCard({ details }: SeparabilityCardProps) {
  const { verb, particle, separable, separabilityExplanation } = details || {};

  return (
    <div className="space-y-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Split size={24} />
          </div>
          <h5 className="text-xl font-black text-white">2. Separability</h5>
        </div>
        <span className={clsx(
          "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
          separable === "no" ? "bg-red-500/20 text-red-400 border border-red-500/20" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
        )}>
          {separable === "no" ? "Fixed Unit" : "Splitable"}
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
            <Info size={14} /> Can we split it?
          </p>
          <p className="text-zinc-300 leading-relaxed">
            {safeVal(separabilityExplanation) || (separable === "no" 
              ? "No way! The verb and the particle are best friends. They must stay together." 
              : "Yes! You can put the object in the middle like a sandwich.")}
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Standard Style</span>
              <Check size={12} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-white">{verb}</span>
              <span className="text-blue-400">{particle}</span>
              <span className="text-zinc-500">the object</span>
            </div>
          </div>
          
          {separable !== "no" && (
            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-purple-400">
                <span>Sandwich Style (Middle)</span>
                <Check size={12} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <span className="text-white">{verb}</span>
                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">the object</span>
                <span className="text-blue-400">{particle}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
