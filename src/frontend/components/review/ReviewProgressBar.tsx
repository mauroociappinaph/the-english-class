import { motion } from "framer-motion";
import { ReviewProgressBarProps } from "@/frontend/types/components";

export function ReviewProgressBar({ progress }: ReviewProgressBarProps) {
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
