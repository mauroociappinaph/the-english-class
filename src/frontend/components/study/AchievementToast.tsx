import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useAchievementStore } from '@/frontend/store/useAchievementStore';

export const AchievementToast: React.FC = () => {
  const { newlyUnlocked, clearNewNotification } = useAchievementStore();

  useEffect(() => {
    if (newlyUnlocked) {
      const timer = setTimeout(() => {
        clearNewNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked, clearNewNotification]);

  return (
    <AnimatePresence>
      {newlyUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
        >
          <div className="relative p-6 rounded-3xl bg-zinc-900 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
            
            <div className="relative flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
                <div className="relative p-4 rounded-2xl bg-white text-black shadow-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Badge Unlocked</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <h3 className="text-xl font-black text-white leading-tight">
                  {newlyUnlocked.title}
                </h3>
                <p className="text-sm text-white/50">
                  {newlyUnlocked.description}
                </p>
              </div>

              <button 
                onClick={clearNewNotification}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/30 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Particle effects (simulated with dots) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-20">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div 
                  key={i}
                  animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ delay: i * 0.2, repeat: Infinity, duration: 1.5 }}
                  className="w-1 h-1 bg-white rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
