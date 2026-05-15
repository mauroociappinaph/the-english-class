"use client";

import { useState, useEffect } from "react";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { getExpressions, deleteExpression } from "./actions";
import { Expression } from "@/shared/types/expression";

import { ExpressionLibrary } from "@/frontend/components/ExpressionLibrary";
import { StudySection } from "@/frontend/components/StudySection";
import { getCefrStyle } from "@/frontend/components/cefr-styles";

import { GrammarSection } from "@/frontend/components/GrammarSection";
import { AchievementToast } from "@/frontend/components/study/AchievementToast";
import { AnalysisHero } from "@/frontend/components/home/AnalysisHero";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"search" | "library" | "study" | "grammar">("search");
  const { setExpressions } = useStudyStore();

  useEffect(() => {
    const fetchLibrary = async () => {
      const library = await getExpressions();
      setExpressions(library);
    };
    fetchLibrary();
  }, [setExpressions]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab === "grammar" || tab === "library" || tab === "study" || tab === "search") {
      setActiveTab(tab as "search" | "library" | "study" | "grammar");
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:h-20 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center">
            <span className="text-sm font-black uppercase tracking-[0.4em] text-white">Chronos <span className="text-blue-500">v4.0</span></span>
          </div>
          
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: "search", label: "Neural Engine" },
              { id: "library", label: "Archive" },
              { id: "study", label: "Study" },
              { id: "grammar", label: "Grammar" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "search" | "library" | "study" | "grammar")}
                className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-white text-black shadow-2xl shadow-white/10" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        {activeTab === "search" && <AnalysisHero />}

        {activeTab === "library" && <ExpressionLibrary />}

        {activeTab === "study" && <StudySection />}
        {activeTab === "grammar" && <GrammarSection />}
      </div>
      <AchievementToast />
    </div>
  );
}
