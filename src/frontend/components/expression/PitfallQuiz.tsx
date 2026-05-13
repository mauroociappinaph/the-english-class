"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { PitfallQuizProps } from "./types";

export function PitfallQuiz({ mistake }: PitfallQuizProps) {
  const [selected, setSelected] = useState<"wrong" | "right" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Simple parser for "Don't say X, say Y" or similar patterns
  // Expected format from AI: "Don't say '...', say '...'"
  const parseMistake = (text: string) => {
    const regex = /Don['’]t say ['"“](.*)['"”],?\s+say\s+['"“](.*)['"”]/i;
    const match = text.match(regex);

    if (match) {
      return {
        wrong: match[1],
        right: match[2],
        isParsable: true,
      };
    }

    return {
      wrong: text,
      right: "",
      isParsable: false,
    };
  };

  const { wrong, right, isParsable } = parseMistake(mistake);

  if (!isParsable) {
    return (
      <div className="space-y-4">
        <p className="text-zinc-400 text-xl leading-relaxed italic">
          &ldquo;{mistake}&rdquo;
        </p>
      </div>
    );
  }

  const handleChoice = (choice: "wrong" | "right") => {
    setSelected(choice);
    if (choice === "right") {
      setShowExplanation(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {/* Wrong Option */}
        <motion.button
          onClick={() => handleChoice("wrong")}
          animate={selected === "wrong" ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
            selected === "wrong"
              ? "border-red-500/50 bg-red-500/10"
              : "border-white/5 bg-white/5 hover:border-white/10"
          }`}
        >
          <span className={`text-lg ${selected === "wrong" ? "text-red-400" : "text-zinc-400"}`}>
            {wrong}
          </span>
          {selected === "wrong" && <XCircle size={18} className="text-red-500" />}
        </motion.button>

        {/* Right Option */}
        <motion.button
          onClick={() => handleChoice("right")}
          whileTap={{ scale: 0.98 }}
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
            selected === "right"
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-white/5 bg-white/5 hover:border-white/10"
          }`}
        >
          <span className={`text-lg font-bold ${selected === "right" ? "text-emerald-400" : "text-white"}`}>
            {right}
          </span>
          {selected === "right" && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </motion.div>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {selected === "right" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
          >
            <AlertCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-400/80 leading-relaxed">
              <strong>Exactly!</strong> Using &ldquo;{right}&rdquo; sounds much more natural in this context.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
