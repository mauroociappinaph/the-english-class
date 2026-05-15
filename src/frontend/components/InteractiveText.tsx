"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { InteractiveTextProps } from "@/frontend/types/components";


import { HelpCircle, Eye } from "lucide-react";

export function InteractiveText({ text, translation, className = "", label }: InteractiveTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  if (!text) return null;

  return (
    <div 
      className={`relative inline-block group cursor-help ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsRevealed(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsRevealed(true);
      }}
    >
      <span className={`border-b border-dotted transition-colors ${
        isRevealed ? 'border-emerald-400 text-emerald-300' : 'border-zinc-500 group-hover:border-blue-400 group-hover:text-blue-300'
      }`}>
        {text}
      </span>
      
      <AnimatePresence>
        {isHovered && translation && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 ${
              isRevealed ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {!isRevealed ? (
              <>
                <HelpCircle size={12} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Reveal {label || 'Meaning'}?
                </span>
              </>
            ) : (
              <>
                <Eye size={12} />
                <span className="text-xs font-bold">{translation}</span>
              </>
            )}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${
              isRevealed ? 'border-t-emerald-600' : 'border-t-blue-600'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
