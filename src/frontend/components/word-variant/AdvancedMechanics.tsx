import { Info, ArrowRightLeft } from "lucide-react";
import { TagChip } from "../ui/TagChip";
import { AdvancedMechanicsProps } from "./types";

export function AdvancedMechanics({ variant }: AdvancedMechanicsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Info size={14} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/50">Common Partners</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {variant.commonCollocations?.map((coll) => (
            <TagChip key={coll} variant="blue">
              {coll}
            </TagChip>
          )) || null}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <ArrowRightLeft size={14} className="text-purple-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400/50">Synonyms & Antonyms</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {variant.synonyms?.slice(0, 3).map(syn => (
            <TagChip key={syn} variant="purple">
              {syn}
            </TagChip>
          )) || null}
          {variant.antonyms?.slice(0, 2).map(ant => (
            <TagChip key={ant} variant="zinc">
              {ant}
            </TagChip>
          )) || null}
        </div>
      </div>
    </div>
  );
}
