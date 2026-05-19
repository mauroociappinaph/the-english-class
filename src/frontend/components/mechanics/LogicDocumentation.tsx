"use client";

import { motion } from "framer-motion";
import { LogicDocumentationProps } from "@/frontend/types/components";
import { TransitivityCard } from "./TransitivityCard";
import { SeparabilityCard } from "./SeparabilityCard";
import { SyntaxAnatomy } from "./SyntaxAnatomy";
import { UsageLogicSection } from "./UsageLogicSection";

export const LogicDocumentation: React.FC<LogicDocumentationProps> = ({ details }) => {
  if (!details) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 w-full"
    >
      <div className="flex flex-col gap-2">
        <h4 className="text-2xl font-black text-white tracking-tight uppercase">Logic & Assembly Rules</h4>
        <p className="text-zinc-500 text-sm">Mechanical and syntactic constraints of this phrasal verb</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransitivityCard details={details} />
        <SeparabilityCard details={details} />
      </div>

      <SyntaxAnatomy details={details} />
      <UsageLogicSection details={details} />
    </motion.div>
  );
};
