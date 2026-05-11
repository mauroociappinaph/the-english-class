import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { SearchBarProps } from "@/frontend/types/components";


export function SearchBar({ input, setInput, handleSearch, isAnalyzing }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto sticky top-8 z-50 pt-8">
      <motion.form 
        onSubmit={handleSearch}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-deep rounded-full p-2 flex items-center shadow-2xl"
      >
        <div className="flex-1 flex items-center px-6 gap-4">
          <Search className="text-zinc-500" size={20} />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analyze expression..."
            className="bg-transparent border-none outline-none text-white w-full py-3 text-lg placeholder:text-zinc-600 font-medium"
          />
        </div>
        <button 
          type="submit"
          disabled={isAnalyzing}
          className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {isAnalyzing ? "..." : "Analyze"}
        </button>
      </motion.form>
    </div>
  );
}
