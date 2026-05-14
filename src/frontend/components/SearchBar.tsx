import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

import { SearchBarProps } from "@/frontend/types/components";


export function SearchBar({ input, setInput, handleSearch, isAnalyzing }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto sticky top-8 z-50 pt-8">
      <motion.form
        onSubmit={handleSearch}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="rounded-full border border-white/10 bg-zinc-950 p-1.5 flex items-center"
      >
        <div className="flex-1 flex items-center px-6 gap-3">
          <Search className="text-zinc-600 shrink-0" size={18} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type any expression, phrase, or word..."
            className="bg-transparent border-none outline-none text-white w-full py-3 text-base placeholder:text-zinc-700 font-medium"
            autoFocus
          />
        </div>
        <motion.button
          type="submit"
          disabled={isAnalyzing}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analyzing
            </>
          ) : (
            "Analyze"
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}
