import React from 'react';
import { motion } from 'framer-motion';
import { Box, Zap, Palette, Wind, Info } from 'lucide-react';
import { WordVariant } from '@/shared/types/expression';
import { clsx } from 'clsx';
import { MorphologyTreeProps } from '@/frontend/types/word-variant';

const posConfig = {
  noun: { label: 'Noun', icon: Box, color: 'text-blue-400', stroke: '#3b82f6' },
  verb: { label: 'Verb', icon: Zap, color: 'text-emerald-400', stroke: '#10b981' },
  adjective: { label: 'Adjective', icon: Palette, color: 'text-amber-400', stroke: '#f59e0b' },
  adverb: { label: 'Adverb', icon: Wind, color: 'text-purple-400', stroke: '#a855f7' },
};

export function MorphologyTree({ families, rootWord }: MorphologyTreeProps) {
  const entries = Object.entries(families).filter(([_, variants]) => variants && variants.length > 0);

  return (
    <div className="w-full aspect-[16/9] md:aspect-[21/9] relative flex items-center justify-center overflow-visible py-20">
      {/* Visual background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50" />
      
      {/* SVG Connectors Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated paths would go here - for simplicity in this first version we'll use CSS-based layouts but SVG paths provide the premium 'connected' feel */}
      </svg>

      {/* The Central Root */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 group"
      >
        <div className="absolute -inset-8 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="px-12 py-6 rounded-[2rem] bg-zinc-950 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60">The Root</span>
          <h3 className="text-4xl font-black text-white tracking-tighter">{rootWord}</h3>
          <div className="flex gap-1 mt-2">
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-blue-500/40" />
            <div className="w-1 h-1 rounded-full bg-blue-500/10" />
          </div>
        </div>
      </motion.div>

      {/* Orbital Branches */}
      <div className="absolute inset-0 pointer-events-none">
        {entries.map(([pos, rawVariants], index) => {
          const variants = rawVariants as WordVariant[];
          const config = posConfig[pos as keyof typeof posConfig];
          if (!config || !variants) return null;

          // Simple orbital positioning logic
          const angle = (index * (360 / entries.length)) * (Math.PI / 180);
          const radiusX = 300;
          const radiusY = 150;
          const x = Math.cos(angle) * radiusX;
          const y = Math.sin(angle) * radiusY;

          return (
            <motion.div
              key={pos}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              {/* Branch Container */}
              <div className="flex flex-col items-center gap-4">
                {/* PoS Label */}
                <div className={clsx(
                  "px-4 py-1.5 rounded-full border flex items-center gap-2 backdrop-blur-md",
                  config.color.replace('text', 'bg').replace('400', '500/10'),
                  config.color.replace('text', 'border').replace('400', '500/20')
                )}>
                  <config.icon size={12} className={config.color} />
                  <span className={clsx("text-[10px] font-black uppercase tracking-widest", config.color)}>
                    {config.label}s
                  </span>
                </div>

                {/* Variant Nodes */}
                <div className="flex flex-col gap-3">
                  {variants.slice(0, 2).map((v, i) => (
                    <motion.div 
                      key={v.word}
                      whileHover={{ scale: 1.05, x: index < entries.length / 2 ? 10 : -10 }}
                      className="px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer group/node"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-white font-black tracking-tight">{v.word}</span>
                          <span className="text-[9px] text-zinc-600 font-bold uppercase">{v.pronunciation}</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black text-zinc-500 uppercase">
                          {v.cefr}
                        </div>
                      </div>
                      
                      {/* DNA Highlighter (Hidden by default, shows on hover or subtle line) */}
                      <div className="mt-2 h-0.5 w-full bg-white/5 rounded-full overflow-hidden opacity-0 group-hover/node:opacity-100 transition-opacity">
                        <div className="h-full bg-blue-500/40 w-1/3" />
                      </div>
                    </motion.div>
                  ))}
                  {variants.length > 2 && (
                    <div className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest text-center">
                      + {variants.length - 2} more
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting Line (Simple version using CSS before SVG pathing) */}
              <div className="absolute top-1/2 left-1/2 w-px h-px -z-10">
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-t from-transparent via-white/5 to-transparent"
                  style={{ 
                    height: `${Math.sqrt(x*x + y*y)}px`, 
                    transform: `rotate(${angle * (180/Math.PI) + 90}deg)`,
                    transformOrigin: 'bottom'
                  }} 
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
