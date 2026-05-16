import { Info, Lightbulb, AlertCircle, Check, X, Compass } from "lucide-react";
import { EducationalInsightsProps } from "./types";

export function EducationalInsights({ variant }: EducationalInsightsProps) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grammar Logic */}
        <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-6 group hover:bg-blue-500/10 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-400">
              <Compass size={20} className="group-hover:rotate-45 transition-transform duration-700" />
              <h5 className="text-sm font-black uppercase tracking-[0.2em]">Grammar Logic</h5>
            </div>
            <span className="text-[10px] font-black text-blue-500/40 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10">Rule</span>
          </div>
          <p className="text-sm text-blue-200/80 leading-relaxed italic font-medium">
            "{variant.grammarExplanation}"
          </p>
        </div>

        {/* Pro Tip / Nuance */}
        <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-6 group hover:bg-amber-500/10 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-400">
              <Lightbulb size={20} />
              <h5 className="text-sm font-black uppercase tracking-[0.2em]">Usage Secret</h5>
            </div>
            <span className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10">Nuance</span>
          </div>
          <div className="space-y-3">
            {variant.tips?.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <p className="text-sm text-amber-100/70 leading-relaxed">{tip}</p>
              </div>
            )) || (
              <p className="text-sm text-amber-200/40 italic">Native speakers often use this to emphasize process over result.</p>
            )}
          </div>
        </div>
      </div>

      {/* Common Mistakes - Duolingo Style */}
      {variant.commonMistakes && (
        <div className="p-10 rounded-[3rem] bg-red-500/[0.03] border border-red-500/10 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10">
                <AlertCircle size={24} />
              </div>
              <div>
                <h5 className="text-sm font-black text-red-400 uppercase tracking-[0.3em]">The Common Trap</h5>
                <p className="text-lg font-bold text-white tracking-tight">Avoid this typical mistake</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3">
                <div className="flex items-center gap-2 text-red-500">
                  <X size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Incorrect</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed line-through decoration-red-500/30 italic">
                  {variant.commonMistakes.split('✅')[0]?.replace('❌', '').trim() || variant.commonMistakes}
                </p>
              </div>

              {variant.commonMistakes.includes('✅') && (
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Check size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Correct Way</span>
                  </div>
                  <p className="text-sm text-emerald-100 font-medium italic">
                    {variant.commonMistakes.split('✅')[1]?.trim()}
                  </p>
                </div>
              )}
            </div>
            
            {!variant.commonMistakes.includes('✅') && (
              <p className="text-sm text-zinc-500 leading-relaxed italic border-t border-white/5 pt-6">
                <span className="text-red-400/60 font-black uppercase tracking-widest mr-2">Note:</span>
                {variant.commonMistakes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
