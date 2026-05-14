import { Target } from "lucide-react";
import { ExampleSectionProps } from "./types";

export function ExampleSection({ variant }: ExampleSectionProps) {
  // Data Consistency: Ensure examples match the variant word.
  const filteredExamples = variant.examples?.filter(ex => 
    ex.text.toLowerCase().includes(variant.word.toLowerCase().split(' ')[0])
  ) || [];

  const finalExamples = filteredExamples.length > 0 ? filteredExamples : (variant.examples || []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <Target size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">Examples in Action</h4>
          <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1">Natural usage scenarios</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {finalExamples.length > 0 ? (
          finalExamples.slice(0, 3).map((ex, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/ex">
              <p className="text-white text-base font-medium italic leading-relaxed">
                "{ex.text}"
              </p>
              <p className="mt-3 text-xs text-zinc-500 uppercase font-black tracking-widest group-hover/ex:text-emerald-500/70 transition-colors">
                {ex.translation}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center opacity-40">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No matching specimens detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
