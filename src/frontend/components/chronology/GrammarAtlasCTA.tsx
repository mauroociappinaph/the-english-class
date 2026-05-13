import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Globe, Layers } from 'lucide-react';

export const GrammarAtlasCTA: React.FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full mt-12 p-10 rounded-3xl bg-gradient-to-br from-indigo-600/20 via-blue-600/20 to-violet-600/20 border border-white/10 overflow-hidden group"
    >
      {/* Background Holographic Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-white/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] group-hover:bg-violet-500/20 transition-colors" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-left">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 animate-pulse" />
            <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <Compass className="w-10 h-10 text-blue-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">Advanced Infrastructure</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Access Full Grammar Atlas</h3>
            <p className="text-blue-100/40 text-sm max-w-md leading-relaxed">
              Expand your linguistic consciousness with our AI-driven educational operating system. Discover deep connections across the entire grammar universe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[Globe, Layers, Sparkles].map((Icon, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <Icon className="w-4 h-4 text-white/60" />
              </div>
            ))}
          </div>
          <div className="h-10 w-[1px] bg-white/10 mx-2" />
          <motion.div
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold text-sm tracking-tight shadow-lg shadow-blue-500/30 group-hover:bg-blue-400 transition-colors"
          >
            INITIALIZE_EXPANSION
          </motion.div>
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
    </motion.button>
  );
};
