"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, GraduationCap, Zap, Clock, Info } from "lucide-react";
import { useState, useEffect } from "react";

const STEPS = [
  {
    id: "intro",
    title: "Linguistic Immersion",
    description: "Welcome to your deep analysis. We don't just translate; we decode how English works at its core.",
    icon: <GraduationCap size={32} className="text-blue-400" />,
  },
  {
    id: "morphology",
    title: "What is Morphology?",
    description: "It's the study of word structure. In the Mechanics section, you'll see how this expression connects to other word families and how its 'DNA' changes form.",
    icon: <Zap size={32} className="text-yellow-400" />,
    targetId: "mechanics",
  },
  {
    id: "chronology",
    title: "What is Chronology?",
    description: "It's temporal mapping. We show you exactly how the expression adapts across past, present, and future timelines so you never miss a beat.",
    icon: <Clock size={32} className="text-emerald-400" />,
    targetId: "chronology",
  }
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("has_seen_onboarding_tour");
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setCurrentStep(0);
      }, 1500); // Wait for the page to settle
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      
      // Scroll to target if it exists
      const targetId = STEPS[currentStep + 1].targetId;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("has_seen_onboarding_tour", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-zinc-900/90 border border-white/10 rounded-[2.5rem] p-10 shadow-3xl overflow-hidden relative"
          >
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
            
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                  {STEPS[currentStep].icon}
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">
                     Step {currentStep + 1} of {STEPS.length}
                   </p>
                   <h3 className="text-2xl font-black text-white">{STEPS[currentStep].title}</h3>
                </div>
              </div>

              <p className="text-zinc-400 leading-relaxed font-medium">
                {STEPS[currentStep].description}
              </p>

              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-1.5">
                   {STEPS.map((_, i) => (
                     <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-blue-400' : 'w-2 bg-zinc-800'}`} 
                     />
                   ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="bg-white text-black px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                  {currentStep === STEPS.length - 1 ? "Finish Tour" : "Continue"}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
