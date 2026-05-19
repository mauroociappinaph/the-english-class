import { Lightbulb, Info } from "lucide-react";
import { UsageLogicSectionProps } from "@/frontend/types/components";
import { safeVal } from "@/frontend/utils/linguistics";

export function UsageLogicSection({ details }: UsageLogicSectionProps) {
  const { logicExplanation } = details || {};

  return (
    <div className="space-y-6 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group/logic">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/logic:opacity-100 transition-opacity duration-700" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-400 group-hover/logic:text-purple-400 transition-colors">
          <Lightbulb size={24} />
        </div>
        <div>
          <h5 className="text-xl font-black text-white">Usage Logic & Context</h5>
          <p className="text-sm text-zinc-500">Why native speakers use it this way</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Info size={14} /> Conceptual Model
        </p>
        <p className="text-zinc-300 leading-relaxed text-lg">
          {safeVal(logicExplanation) || "This combination blends the physical motion of the verb with the state or direction of the particle, creating a new abstract meaning."}
        </p>
      </div>
    </div>
  );
}
