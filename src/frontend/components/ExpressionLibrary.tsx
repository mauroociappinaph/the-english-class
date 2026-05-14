import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Search, Filter } from "lucide-react";
import { ExpressionLibraryProps } from "@/frontend/types/components";

export function ExpressionLibrary({ expressions, getCefrStyle, onDelete, onViewDetail }: ExpressionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const filteredExpressions = useMemo(() => {
    return expressions.filter((ex) => {
      const matchesSearch = 
        ex.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.translation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel ? ex.metadata.cefr === selectedLevel : true;
      return matchesSearch && matchesLevel;
    });
  }, [expressions, searchQuery, selectedLevel]);

  return (
    <div className="space-y-8 w-full">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-6 rounded-[3rem] border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in your library..."
            className="w-full bg-black/40 border border-white/10 rounded-3xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 items-center overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button 
            onClick={() => setSelectedLevel(null)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              selectedLevel === null ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {levels.map((level) => (
            <button 
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedLevel === level ? getCefrStyle(level).bg + " text-white" : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredExpressions.map((ex, i) => (
            <motion.div 
              key={ex.id || i}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-6 rounded-3xl space-y-3 relative group overflow-hidden h-full flex flex-col"
            >
              <div 
                className={`absolute top-0 right-0 w-2 h-full ${getCefrStyle(ex?.metadata.cefr || 'A1').bg}`} 
                style={{ boxShadow: `-5px 0 15px rgba(${getCefrStyle(ex?.metadata.cefr || 'A1').glow}, 0.2)` }}
              />
              
              <button 
                onClick={async (e) => {
                  e.stopPropagation();
                  if (ex.id) await onDelete(ex.id);
                }}
                className="absolute top-2 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
              >
                <X size={14} />
              </button>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{ex?.metadata.type}</span>
                <span className={`text-sm font-black ${getCefrStyle(ex?.metadata.cefr || 'A1').text}`}>{ex?.metadata.cefr}</span>
              </div>
              
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-black text-white">{ex?.text}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{ex?.translation}</p>
              </div>

              <button 
                onClick={() => onViewDetail(ex)}
                className="text-sm text-blue-400 font-bold flex items-center gap-1 mt-4 hover:translate-x-1 transition-transform"
              >
                Ver detalle <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredExpressions.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 flex flex-col items-center justify-center space-y-4 border border-dashed border-white/10 rounded-[3rem]"
        >
          <div className="p-6 rounded-full bg-white/5 text-zinc-600">
            <Filter size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-zinc-400">No expressions found</h3>
            <p className="text-sm text-zinc-400">Try adjusting your filters or search query.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
