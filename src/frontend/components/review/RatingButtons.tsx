import { motion } from "framer-motion";
import { RatingButtonsProps } from "@/frontend/types/components";

const performanceConfig: { value: import("@/frontend/types/store").StudyPerformance; label: string; emoji: string; color: string; sublabel: string }[] = [
  { value: "hard", label: "Hard", emoji: "😤", color: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30", sublabel: "Again soon" },
  { value: "good", label: "Good", emoji: "👍", color: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30", sublabel: "In ~1 day" },
  { value: "easy", label: "Easy", emoji: "🔥", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30", sublabel: "In ~6 days" },
];

export function RatingButtons({ onRate, isSubmitting }: RatingButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full grid grid-cols-3 gap-3"
    >
      {performanceConfig.map(({ value, label, emoji, color, sublabel }) => (
        <button
          key={value}
          onClick={() => onRate(value)}
          disabled={isSubmitting}
          className={`flex flex-col items-center gap-1 py-4 px-3 rounded-2xl border transition-all font-bold ${color} disabled:opacity-50`}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm">{label}</span>
          <span className="text-sm text-zinc-400 font-medium">{sublabel}</span>
        </button>
      ))}
    </motion.div>
  );
}
