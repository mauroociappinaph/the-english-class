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
import { Flashcard } from "./review/Flashcard";
import { createCloze } from "@/frontend/utils/linguistics";
import { SessionSummary } from "./study/SessionSummary";

const performanceConfig: { value: StudyPerformance; label: string; emoji: string; color: string; sublabel: string }[] = [
  { value: "hard", label: "Hard", emoji: "😤", color: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30", sublabel: "Again soon" },
  { value: "good", label: "Good", emoji: "👍", color: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30", sublabel: "In ~1 day" },
  { value: "easy", label: "Easy", emoji: "🔥", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30", sublabel: "In ~6 days" },
];

export function ReviewSession() {
  const { 
    reviewQueue, 
    currentReviewIndex, 
    isFlipped, 
    flipCard, 
    nextCard, 
    endReview,
    isTestMode,
    toggleTestMode,
    isFinished
  } = useStudyStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInput, setUserInput] = useState("");

  if (isFinished) {
    return <SessionSummary />;
  }

  const currentExpression = reviewQueue[currentReviewIndex];
  const progress = ((currentReviewIndex) / reviewQueue.length) * 100;

  if (!currentExpression) return null;

  const handleRate = async (performance: StudyPerformance) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await submitReview(currentExpression.id, performance);
      const wasError = performance === "hard" || (isTestMode && !isCorrect);
      setUserInput(""); // Reset input for next card
      nextCard(updated, wasError);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cefrStyle = getCefrStyle(currentExpression.metadata.cefr);
  const clozeSentence = currentExpression.linguistics.examples.length > 0 
    ? createCloze(currentExpression.text, currentExpression.linguistics.examples[0].text)
    : "";

  const handleCheck = () => {
    flipCard();
  };

  const isCorrect = userInput.toLowerCase().trim() === currentExpression.text.toLowerCase().trim();

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

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => isTestMode && toggleTestMode()}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${!isTestMode ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Study
          </button>
          <button
            onClick={() => !isTestMode && toggleTestMode()}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isTestMode ? 'bg-purple-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
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
      <Flashcard
        isFlipped={isFlipped}
        onFlip={() => !isFlipped && !isTestMode && flipCard()}
        disableFlipClick={isTestMode && !isFlipped}
        front={
          <div className="flex flex-col items-center gap-8 w-full">
            {isTestMode ? (
              <div className="space-y-6 w-full">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-400 font-black">Active Recall Mode</p>
                  <p className="text-xl text-zinc-300 leading-relaxed font-medium">
                    {clozeSentence || currentExpression.translation}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type the missing word..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && userInput && handleCheck()}
                    autoFocus
                  />
                  <button
                    onClick={handleCheck}
                    disabled={!userInput}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20"
                  >
                    Check Answer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black tracking-tight leading-tight">
                  {currentExpression.text}
                </p>
                {currentExpression.metadata.ipa && (
                  <p className="text-zinc-500 text-sm font-mono mt-2">{currentExpression.metadata.ipa}</p>
                )}
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-8">
                  <RotateCcw size={14} />
                  <span>Tap to reveal</span>
                </div>
              </>
            )}
          </div>
        }
        back={
          <div className="space-y-6 w-full">
            {isTestMode && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{isCorrect ? '✨' : '😅'}</span>
                  <p className="font-bold text-sm uppercase tracking-wider">{isCorrect ? 'Perfect!' : 'Not quite'}</p>
                </div>
                <p className="text-sm font-black opacity-80">{isCorrect ? 'You nailed it' : 'Keep practicing'}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-zinc-500 font-bold">Expression</p>
              <p className="text-3xl font-black text-white">
                {currentExpression.text}
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest text-zinc-500 font-bold">Translation</p>
                <p className="text-lg font-bold text-blue-400">
                  {currentExpression.translation}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest text-zinc-500 font-bold">CEFR Level</p>
                <p className={`text-lg font-bold ${cefrStyle.text}`}>
                  {currentExpression.metadata.cefr}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-zinc-500 font-bold">Meaning</p>
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

            {currentExpression.linguistics.examples.length > 0 && (
              <>
                <div className="w-full h-px bg-white/10" />
                <div className="space-y-2 text-left">
                  <p className="text-sm uppercase tracking-widest text-zinc-500 font-bold">Full Example</p>
                  <p className="text-zinc-400 text-sm italic">
                    &ldquo;{currentExpression.linguistics.examples[0].text}&rdquo;
                  </p>
                </div>
              </>
            )}
          </div>
        }
      />

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
                <span className="text-sm text-zinc-400 font-medium">{sublabel}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
