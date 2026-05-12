"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudyStore } from "@/frontend/store/useStudyStore";
import { getCefrStyle } from "@/frontend/components/cefr-styles";
import { getExpressionById } from "@/app/actions";
import { Expression } from "@/shared/types/expression";

export default function ExpressionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const pathname = usePathname();
  const { id } = resolvedParams;
  const { expressions, setCurrentAnalysis, currentAnalysis } = useStudyStore();
  const [isLoading, setIsLoading] = useState(!currentAnalysis || currentAnalysis.id !== id);

  useEffect(() => {
    const loadExpression = async () => {
      // 1. Check if already in store
      const inStore = expressions.find((e) => e.id === id);
      if (inStore) {
        setCurrentAnalysis(inStore);
        setIsLoading(false);
        return;
      }

      // 2. Fetch from DB if not in store (direct access)
      const data = await getExpressionById(id);
      if (data) {
        // Adapt dates for frontend if necessary, but store usually handles it
        setCurrentAnalysis(data as unknown as Expression);
      }
      setIsLoading(false);
    };

    loadExpression();
  }, [id, expressions, setCurrentAnalysis]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 animate-pulse font-medium">Loading expression...</p>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="w-full text-center py-40">
        <h2 className="text-2xl font-bold text-white">Expression not found</h2>
        <Link href="/" className="text-blue-500 hover:underline mt-4 block">Return to Library</Link>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: `/expression/${id}` },
    { label: "Chronology", href: `/expression/${id}/chronology` },
    { label: "Scenarios", href: `/expression/${id}/scenarios` },
    { label: "Mastery", href: `/expression/${id}/mastery` },
  ];

  return (
    <div className="w-full relative min-h-screen">
      {/* Background Aura */}
      <div 
        className="glow-aura fixed inset-0 pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at 50% 30%, rgba(${getCefrStyle(currentAnalysis.cefr).glow}, 0.3) 0%, transparent 70%)`
        }}
      />

      <div className="flex flex-col items-center pt-20 pb-40 px-4 max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          href="/" 
          className="absolute left-4 top-8 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-xs font-black uppercase tracking-widest">Library</span>
        </Link>

        {/* Hero Section (Sticky-ish or fixed at top) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-20"
        >
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-zinc-500 opacity-50 block">
            {currentAnalysis.type}
          </span>
          <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter text-white text-glow leading-tight">
            {currentAnalysis.text}
          </h1>
          <div className="flex items-center justify-center gap-8">
            <p className="text-zinc-500 italic font-mono text-2xl">{currentAnalysis.ipa}</p>
            <div className={`w-12 h-12 flex items-center justify-center ${getCefrStyle(currentAnalysis.cefr).bg} rounded-full text-white font-black text-xs`}>
              {currentAnalysis.cefr}
            </div>
          </div>
        </motion.div>

        {/* Internal Navigation */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit mb-24 sticky top-8 backdrop-blur-md z-20">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? "bg-white text-black shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
