"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { ChronologyEngine } from "@/frontend/components/chronology/ChronologyEngine";
import { CollapsiblePanel } from "@/frontend/components/ui/CollapsiblePanel";
import { SectionDivider } from "./SectionDivider";
import { sectionVariants } from "./types";
import { ChronologyData } from "@/shared/types/expression";

interface ExpressionChronologyProps {
  chronology: ChronologyData;
}

export function ExpressionChronology({ chronology }: ExpressionChronologyProps) {
  return (
    <div>
      <SectionDivider label="chronology" type="secondary" />
      <motion.section
        id="chronology"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="space-y-10"
      >
        <CollapsiblePanel
          title="Verb Tenses & Chronology"
          subtitle="Map out past, present, and future timelines for this expression"
          icon={Clock}
        >
          <ChronologyEngine data={chronology} />
        </CollapsiblePanel>
      </motion.section>
    </div>
  );
}
