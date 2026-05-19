"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { CollapsiblePanelProps } from "@/frontend/types/components";

export function CollapsiblePanel({
  title,
  subtitle,
  icon: Icon,
  children,
  defaultOpen = false,
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full rounded-[2.5rem] bg-zinc-950/40 border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-8 py-8 md:px-12 md:py-10 flex items-center justify-between gap-6 group focus:outline-none"
      >
        <div className="flex items-center gap-6">
          <div className={clsx(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border",
            isOpen 
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
              : "bg-white/5 border-white/10 text-zinc-400 group-hover:bg-white/10 group-hover:text-white"
          )}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
          isOpen
            ? "border-blue-500/30 bg-blue-500/10 text-blue-400 rotate-180"
            : "border-white/5 bg-white/5 text-zinc-500 group-hover:text-white group-hover:border-white/10"
        )}>
          <ChevronDown size={18} className="transition-transform duration-300" />
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.25, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.15 }
              }
            }}
          >
            <div className="px-8 pb-12 md:px-12 md:pb-16 border-t border-white/5 pt-8 bg-zinc-950/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
