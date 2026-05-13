"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { getExpressionById } from "@/app/actions";
import { Expression } from "@/shared/types/expression";
import { useSectionObserver } from "@/frontend/hooks/useSectionObserver";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "meaning", label: "Meaning" },
  { id: "mechanics", label: "Mechanics" },
  { id: "chronology", label: "Timeline" },
  { id: "scenarios", label: "Scenarios" },
  { id: "mastery", label: "Mastery" },
];

export default function ExpressionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params.id as string;
  const { expressions, setCurrentAnalysis, currentAnalysis } = useStudyStore();
  const [isLoading, setIsLoading] = useState(!currentAnalysis || currentAnalysis.id !== id);
  const activeSection = useSectionObserver(SECTIONS.map(s => s.id));

  useEffect(() => {
    const loadExpression = async () => {
      const inStore = expressions.find((e) => e.id === id);
      if (inStore) {
        setCurrentAnalysis(inStore);
        setIsLoading(false);
        return;
      }

      const data = await getExpressionById(id);
      if (data) {
        setCurrentAnalysis(data as unknown as Expression);
      }
      setIsLoading(false);
    };

    loadExpression();
  }, [id, expressions, setCurrentAnalysis]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-12 w-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-zinc-500 animate-pulse font-medium">Preparing analysis...</p>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="w-full text-center py-40">
        <h2 className="text-2xl font-bold text-white font-display">Expression not found</h2>
        <Link href="/" className="text-zinc-400 hover:text-white mt-4 block underline decoration-zinc-800 underline-offset-8">Return to Library</Link>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen">
      <div className="flex flex-col items-center pt-20 pb-40 px-4 relative z-10">
        {/* Back Button */}
        <Link 
          href="/" 
          className="fixed left-8 top-8 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group z-50"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Library</span>
        </Link>

        {/* Sticky Section Tracker */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-50 hidden lg:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-center justify-end gap-4"
            >
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                activeSection === section.id ? "opacity-100 translate-x-0 text-white" : "opacity-0 translate-x-4 text-zinc-600"
              }`}>
                {section.label}
              </span>
              <div className={`h-1.5 transition-all duration-500 rounded-full ${
                activeSection === section.id ? "w-8 bg-white" : "w-2 bg-zinc-800 group-hover:bg-zinc-600"
              }`} />
            </a>
          ))}
        </div>

        {/* Content Area */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
