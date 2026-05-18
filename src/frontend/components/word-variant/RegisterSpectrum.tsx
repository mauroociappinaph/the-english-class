import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import { RegisterSpectrumProps, Register } from '@/frontend/types/word-variant';

const spectrum = [
  { key: "slang", label: "Slang", position: 5 },
  { key: "informal", label: "Informal", position: 15 },
  { key: "casual conversation", label: "Casual", position: 30 },
  { key: "spoken", label: "Spoken", position: 45 },
  { key: "business", label: "Business", position: 65 },
  { key: "academic", label: "Academic", position: 80 },
  { key: "formal", label: "Formal", position: 90 },
  { key: "literary", label: "Literary", position: 100 },
];

export function RegisterSpectrum({ registers }: RegisterSpectrumProps) {
  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Informal</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Formal</span>
      </div>
      
      <div className="relative h-2 w-full bg-zinc-900 rounded-full border border-white/5 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-zinc-500/10 to-purple-500/10" />
        
        {/* Active Markers */}
        {registers.map((reg, i) => {
          const spec = spectrum.find(s => s.key === reg);
          if (!spec) return null;
          
          return (
            <motion.div
              key={reg}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="absolute top-0 bottom-0 w-8 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center"
              style={{ left: `${spec.position}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-1 h-1 bg-white rounded-full" />
            </motion.div>
          );
        })}
      </div>

      {/* Text Labels for active registers */}
      <div className="flex flex-wrap gap-3">
        {registers.map((reg) => (
          <div key={reg} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-white capitalize">{reg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
