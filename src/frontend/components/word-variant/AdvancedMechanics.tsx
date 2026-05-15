import { Info, ArrowRightLeft, Sparkles, Brain } from "lucide-react";
import { TagList } from "../ui/TagList";
import { AdvancedMechanicsProps } from "./types";

export function AdvancedMechanics({ variant }: AdvancedMechanicsProps) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Collocations / Partners */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-blue-400">
            <Sparkles size={18} />
            <h5 className="text-sm font-black uppercase tracking-widest">Common Partners</h5>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-blue-500/[0.02] border border-blue-500/10 space-y-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">These words love to go together:</p>
            <TagList 
              tags={variant.commonCollocations || []} 
              variant="blue" 
              showCount={false}
              tagClassName="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors"
            />
          </div>
        </div>

        {/* Synonyms & Antonyms */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-purple-400">
            <ArrowRightLeft size={18} />
            <h5 className="text-sm font-black uppercase tracking-widest">The Word Circle</h5>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-purple-500/[0.02] border border-purple-500/10 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Similar meanings:</span>
              <TagList tags={variant.synonyms || []} limit={4} variant="purple" tagClassName="px-4 py-2 rounded-xl text-xs font-bold" />
            </div>
            {variant.antonyms && variant.antonyms.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Opposites:</span>
                <TagList tags={variant.antonyms || []} limit={2} variant="zinc" tagClassName="px-4 py-2 rounded-xl text-xs font-bold" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nuance Section - The "Why this word?" part */}
      {variant.differenceWithSimilar && (
        <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 relative group overflow-hidden">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-lg shadow-purple-500/10">
                <Brain size={24} />
              </div>
              <div>
                <h5 className="text-sm font-black text-purple-400 uppercase tracking-[0.3em]">The Nuance</h5>
                <p className="text-lg font-bold text-white tracking-tight">How is it different from similar words?</p>
              </div>
            </div>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-medium italic bg-white/[0.02] p-8 rounded-2xl border border-white/5">
              "{variant.differenceWithSimilar}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
