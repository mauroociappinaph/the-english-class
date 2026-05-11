import { motion } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

import { ExpressionLibraryProps } from "@/frontend/types/components";


export function ExpressionLibrary({ expressions, getCefrStyle, onDelete, onViewDetail }: ExpressionLibraryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {expressions.map((ex, i) => (
        <div key={ex.id || i} className="glass p-6 rounded-2xl space-y-3 relative group overflow-hidden">
          <div 
            className={`absolute top-0 right-0 w-2 h-full ${getCefrStyle(ex?.cefr || 'A1').bg}`} 
            style={{ boxShadow: `-5px 0 15px rgba(${getCefrStyle(ex?.cefr || 'A1').glow}, 0.2)` }}
          />
          
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              if (ex.id) await onDelete(ex.id);
            }}
            className="absolute top-2 right-4 p-1 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
          >
            <X size={14} />
          </button>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">{ex?.type}</span>
            <span className="text-[10px] font-bold text-white/50">{ex?.cefr}</span>
          </div>
          <h4 className="text-xl font-bold">{ex?.text}</h4>
          <p className="text-zinc-400 text-sm">{ex?.translation}</p>
          <button 
            onClick={() => onViewDetail(ex)}
            className="text-xs text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            Ver detalle <ChevronRight size={12} />
          </button>
        </div>
      ))}
    </motion.div>
  );
}
