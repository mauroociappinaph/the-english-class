"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface FlashcardProps {
  isFlipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function Flashcard({ isFlipped, onFlip, front, back, className }: FlashcardProps) {
  return (
    <div className={clsx("relative w-full min-h-[400px] [perspective:1200px] group", className)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.7, 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          mass: 1.2
        }}
        className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
        onClick={onFlip}
      >
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] w-full h-full">
          <div className="w-full h-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl hover:border-white/20 transition-colors">
            {front}
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full">
          <div className="w-full h-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 flex flex-col items-start text-left shadow-2xl overflow-y-auto custom-scrollbar">
            {back}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
