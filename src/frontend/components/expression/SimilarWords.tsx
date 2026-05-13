import { SimilarWordsProps } from "@/frontend/types/components";

export function SimilarWords({ words, limit }: SimilarWordsProps) {
  if (!words || words.length === 0) return null;
  
  const displayWords = limit ? words.slice(0, limit) : words;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Similar:</span>
      {displayWords.map((word) => (
        <span 
          key={word} 
          className="px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 text-xs font-medium hover:text-white transition-colors cursor-default"
        >
          {word}
        </span>
      ))}
    </div>
  );
}
