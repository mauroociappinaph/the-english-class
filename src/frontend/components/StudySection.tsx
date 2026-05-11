import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function StudySection() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md aspect-[3/4] glass rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-8 shadow-3xl"
    >
      <div className="h-20 w-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
         <GraduationCap size={40} className="text-blue-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl font-bold">Ready for Review?</h3>
        <p className="text-zinc-500">Master 12 expressions today using spaced repetition.</p>
      </div>
      <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-colors shadow-xl">
         Start Session
      </button>
    </motion.div>
  );
}
