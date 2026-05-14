import { Info, Lightbulb, AlertCircle } from "lucide-react";
import { EducationalInsightsProps } from "./types";

export function EducationalInsights({ variant }: EducationalInsightsProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <Info size={18} />
            <h5 className="text-sm font-black uppercase tracking-widest">Grammar Note</h5>
          </div>
          <p className="text-xs text-blue-200/60 leading-relaxed italic">
            {variant.grammarExplanation}
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <Lightbulb size={18} />
            <h5 className="text-sm font-black uppercase tracking-widest">Pro Tip</h5>
          </div>
          <div className="space-y-2">
            {variant.tips?.map((tip, i) => (
              <p key={i} className="text-xs text-amber-200/60 leading-relaxed flex gap-2">
                <span className="text-amber-500">•</span> {tip}
              </p>
            )) || (
              <p className="text-xs text-amber-200/40 italic">Focus on the root meaning for better recall.</p>
            )}
          </div>
        </div>
      </div>

      {variant.commonMistakes && (
        <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 flex items-start gap-4">
          <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Watch out!</h5>
            <p className="text-xs text-red-200/60 leading-relaxed italic">{variant.commonMistakes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
