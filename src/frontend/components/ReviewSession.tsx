"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Volume2, ChevronRight } from "lucide-react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { submitReview } from "@/app/actions";
import { StudyPerformance } from "@/frontend/types/store";
import { useState } from "react";
import { getCefrStyle } from "./cefr-styles";
import { WordFamilyList } from "./WordFamilyList";
import { PhrasalVerbDetails } from "./PhrasalVerbDetails";

const performanceConfig: { value: StudyPerformance; label: string; emoji: string; color: string; sublabel: string }[] = [
  { value: "hard", label: "Hard", emoji: "😤", color: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30", sublabel: "Again soon" },
  { value: "good", label: "Good", emoji: "👍", color: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30", sublabel: "In ~1 day" },
  { value: "easy", label: "Easy", emoji: "🔥", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30", sublabel: "In ~6 days" },
];

export function ReviewSession() {
  const { reviewQueue, currentReviewIndex, isFlipped, flipCard, nextCard, endReview } = useStudyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentExpression = reviewQueue[currentReviewIndex];
  const progress = ((currentReviewIndex) / reviewQueue.length) * 100;

  if (!currentExpression) return null;

  const handleRate = async (performance: StudyPerformance) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await submitReview(currentExpression.id, performance);
      nextCard(updated);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cefrStyle = getCefrStyle(currentExpression.metadata.cefr);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-lg mx-auto flex flex-col items-center gap-6"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-zinc-500">
            {currentReviewIndex + 1} / {reviewQueue.length}
          </span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${cefrStyle.bg} text-white`}>
            {currentExpression.metadata.cefr}
          </span>
        </div>
        <button
          onClick={endReview}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExpression.id + (isFlipped ? "-back" : "-front")}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => !isFlipped && flipCard()}
          className="w-full min-h-[350px] glass rounded-[2rem] p-10 flex flex-col items-center justify-center text-center gap-6 cursor-pointer border border-white/10 hover:border-white/20 transition-colors shadow-2xl"
        >
          {!isFlipped ? (
            /* FRONT: Expression */
            <>
              <p className="text-4xl font-black tracking-tight leading-tight">
                {currentExpression.text}
              </p>
              {currentExpression.metadata.ipa && (
                <p className="text-zinc-500 text-sm font-mono">{currentExpression.metadata.ipa}</p>
              )}
              <div className="flex items-center gap-2 text-zinc-400 text-sm mt-4">
                <RotateCcw size={14} />
                <span>Tap to reveal</span>
              </div>
            </>
          ) : (
            /* BACK: Translation + Meaning */
            <div className="space-y-6 w-full">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Translation</p>
                <p className="text-2xl font-bold text-blue-400">
                  {currentExpression.translation}
                </p>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Meaning</p>
                <p className="text-zinc-300 text-base leading-relaxed">
                  {currentExpression.meaning}
                </p>
              </div>
              {currentExpression.linguistics.wordFamilies && (
                <>
                  <div className="w-full h-px bg-white/10" />
                  <WordFamilyList families={currentExpression.linguistics.wordFamilies} />
                </>
              )}
              {currentExpression.linguistics.phrasalVerbDetails && (
                <>
                  <div className="w-full h-px bg-white/10" />
                  <PhrasalVerbDetails details={currentExpression.linguistics.phrasalVerbDetails} />
                </>
              )}
              {currentExpression.linguistics.examples.length > 0 && (
                <>
                  <div className="w-full h-px bg-white/10" />
                  <div className="space-y-2 text-left">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Example</p>
                    <p className="text-zinc-400 text-sm italic">
                      &ldquo;{currentExpression.linguistics.examples[0].text}&rdquo;
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Rating buttons (only when flipped) */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full grid grid-cols-3 gap-3"
          >
            {performanceConfig.map(({ value, label, emoji, color, sublabel }) => (
              <button
                key={value}
                onClick={() => handleRate(value)}
                disabled={isSubmitting}
                className={`flex flex-col items-center gap-1 py-4 px-3 rounded-2xl border transition-all font-bold ${color} disabled:opacity-50`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm">{label}</span>
                <span className="text-xs text-zinc-400 font-medium">{sublabel}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
