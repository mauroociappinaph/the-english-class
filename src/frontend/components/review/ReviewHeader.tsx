import { X } from "lucide-react";
import { getCefrStyle } from "../cefr-styles";

interface ReviewHeaderProps {
  currentReviewIndex: number;
  queueLength: number;
  cefr: string;
  isTestMode: boolean;
  toggleTestMode: () => void;
  endReview: () => void;
}

export function ReviewHeader({
  currentReviewIndex,
  queueLength,
  cefr,
  isTestMode,
  toggleTestMode,
  endReview
}: ReviewHeaderProps) {
  const cefrStyle = getCefrStyle(cefr);

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-zinc-500">
          {currentReviewIndex + 1} / {queueLength}
        </span>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${cefrStyle.bg} text-white`}>
          {cefr}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
        <button
          onClick={() => isTestMode && toggleTestMode()}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
            !isTestMode ? "bg-blue-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Study
        </button>
        <button
          onClick={() => !isTestMode && toggleTestMode()}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
            isTestMode ? "bg-purple-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Test
        </button>
      </div>

      <button
        onClick={endReview}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
}
