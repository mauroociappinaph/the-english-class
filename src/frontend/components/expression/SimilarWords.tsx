import { SimilarWordsProps } from "@/frontend/types/components";
import { TagChip } from "../ui/TagChip";

export function SimilarWords({ words, limit }: SimilarWordsProps) {
  if (!words || !Array.isArray(words) || words.length === 0) return null;
  
  const displayWords = limit ? words.slice(0, limit) : words;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-black uppercase tracking-widest text-zinc-600">Similar:</span>
      {displayWords.map((word) => (
        <TagChip 
          key={word} 
          variant="zinc"
          className="hover:text-white transition-colors cursor-default"
        >
          {word}
        </TagChip>
      ))}
    </div>
  );
}
