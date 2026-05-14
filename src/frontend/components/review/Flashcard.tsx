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
  disableFlipClick?: boolean;
}

export function Flashcard({ isFlipped, onFlip, front, back, className, disableFlipClick }: FlashcardProps) {
  return (
    <div className={clsx("relative w-full min-h-[420px] [perspective:1500px] group", className)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: 1.02, rotateX: 2 }}
        transition={{ 
          rotateY: { duration: 0.8, type: "spring", stiffness: 120, damping: 20, mass: 1 },
          scale: { duration: 0.2 },
          rotateX: { duration: 0.2 }
        }}
        className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
        onClick={() => !disableFlipClick && onFlip()}
      >
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] w-full h-full">
          <div className="w-full h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-colors">
            {front}
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full">
          <div className="w-full h-full bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 flex flex-col items-start text-left shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar scroll-smooth">
            {back}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
