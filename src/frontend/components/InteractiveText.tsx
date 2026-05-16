"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveTextProps } from "@/frontend/types/components";
import { HelpCircle, Eye, BrainCircuit } from "lucide-react";

export function InteractiveText({ text, translation, className = "", label }: InteractiveTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  if (!text) return null;

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAsking && !isRevealed) {
      setIsAsking(true);
    } else if (isAsking) {
      setIsAsking(false);
      setIsRevealed(true);
    }
  };

  const getQuestion = () => {
    if (label?.toLowerCase().includes('tense')) return "¿Cuál es el tiempo verbal?";
    return `¿Cuál es el ${label || 'significado'}?`;
  };

  return (
    <div 
      className={`relative inline-block group cursor-help ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsRevealed(false);
        setIsAsking(false);
      }}
      onClick={handleInteraction}
    >
      <span className={`border-b border-dotted transition-all duration-300 ${
        isRevealed 
          ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5 px-1 rounded' 
          : isAsking
            ? 'border-amber-400 text-amber-300 bg-amber-500/5 px-1 rounded animate-pulse'
            : 'border-zinc-500 group-hover:border-blue-400 group-hover:text-blue-300'
      }`}>
        {text}
      </span>
      
      <AnimatePresence>
        {(isHovered || isAsking) && translation && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 border ${
              isRevealed 
                ? 'bg-emerald-600 text-white border-emerald-400' 
                : isAsking
                  ? 'bg-amber-600 text-white border-amber-400 scale-110'
                  : 'bg-blue-600 text-white border-blue-400'
            }`}
          >
            {!isRevealed && !isAsking && (
              <>
                <HelpCircle size={12} className="animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest">
                  Reveal {label || 'Meaning'}?
                </span>
              </>
            )}

            {isAsking && (
              <>
                <BrainCircuit size={14} className="animate-bounce" />
                <span className="text-sm font-black uppercase tracking-tight">
                  {getQuestion()}
                </span>
              </>
            )}

            {isRevealed && (
              <>
                <Eye size={12} />
                <span className="text-sm font-bold">{translation}</span>
              </>
            )}
            
            <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${
              isRevealed 
                ? 'border-t-emerald-600' 
                : isAsking
                  ? 'border-t-amber-600'
                  : 'border-t-blue-600'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

