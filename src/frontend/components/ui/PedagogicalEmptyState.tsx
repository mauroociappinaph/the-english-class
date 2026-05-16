import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Search, Sparkles } from 'lucide-react';
import { PedagogicalEmptyStateProps } from '@/frontend/types/components';

export const PedagogicalEmptyState: React.FC<PedagogicalEmptyStateProps> = ({ 
  icon: Icon = Search, 
  title, 
  description, 
  suggestion,
  illustrationPath,
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full py-20 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] -z-10" />

      {illustrationPath ? (
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <img 
            src={illustrationPath} 
            alt="Empty State Illustration" 
            className="w-64 h-64 object-contain relative z-10 animate-float"
          />
        </div>
      ) : (
        <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 mb-8 text-zinc-500">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}

      <div className="max-w-md space-y-4">
        <h3 className="text-2xl font-black text-white tracking-tight leading-none">
          {title}
        </h3>
        <p className="text-zinc-500 font-medium leading-relaxed">
          {description}
        </p>

        {suggestion && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="mt-12 p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative group cursor-pointer overflow-hidden"
            onClick={() => onAction?.(suggestion.action)}
          >
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
              <Sparkles size={16} className="text-blue-400" />
            </div>
            
            <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Neural Suggestion</p>
            <p className="text-blue-400 font-bold italic mb-4">
              "{suggestion.text}"
            </p>
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
              Try searching for: <span className="text-white bg-white/10 px-2 py-1 rounded-lg">"{suggestion.action}"</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
