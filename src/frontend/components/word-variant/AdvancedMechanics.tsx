import { Info, ArrowRightLeft } from "lucide-react";
import { TagChip } from "../ui/TagChip";
import { TagList } from "../ui/TagList";
import { AdvancedMechanicsProps } from "./types";

export function AdvancedMechanics({ variant }: AdvancedMechanicsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Info size={14} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/50">Common Partners</span>
        </div>
        <TagList 
          tags={variant.commonCollocations || []} 
          variant="blue" 
          showCount={false}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <ArrowRightLeft size={14} className="text-purple-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400/50">Synonyms & Antonyms</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <TagList tags={variant.synonyms || []} limit={3} variant="purple" />
          <TagList tags={variant.antonyms || []} limit={2} variant="zinc" />
        </div>
      </div>
    </div>
  );
}
