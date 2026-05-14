"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Zap, MessageSquare, AlertCircle } from "lucide-react";
import { GrammarItem, GrammarSectionProps } from "@/frontend/types/components";

const GRAMMAR_DATA: GrammarSectionProps[] = [
  {
    category: "Past Tenses",
    icon: <Clock className="w-5 h-5 text-blue-400" />,
    items: [
      { name: "Past Simple", example: "I was bossed around by my boss.", description: "Completed actions in the past." },
      { name: "Past Continuous", example: "I was being bossed around by my boss.", description: "Actions that were in progress at a specific time in the past." },
      { name: "Past Perfect", example: "I had been bossed around by my boss.", description: "An action completed before another action in the past." },
      { name: "Past Perfect Continuous", example: "I had been being bossed around by my boss.", description: "Ongoing action that ended before another point in the past." },
      { name: "Past Passive", example: "I was bossed around.", description: "Past action where the receiver is the focus." },
      { name: "Past Perfect Passive", example: "I had been bossed around.", description: "Focus on the receiver before another past event." },
      { name: "Used to", example: "I used to be bossed around.", description: "Past habits or states that no longer exist." },
      { name: "Would (Past Habits)", example: "I would have been bossed around.", description: "Repeated past actions/habits." },
    ]
  },
  {
    category: "Present Tenses",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    items: [
      { name: "Present Simple", example: "I am being bossed around by my boss.", description: "Current habits, general truths, or recurring states." },
      { name: "Present Continuous", example: "I am being bossed around by my boss right now.", description: "Actions happening exactly now." },
      { name: "Present Perfect", example: "I have been bossed around by my boss.", description: "Actions with a connection between the past and present." },
      { name: "Present Perfect Continuous", example: "I have been being bossed around by my boss.", description: "Actions started in the past and continuing now." },
      { name: "Present Passive", example: "I am being bossed around.", description: "Current focus on the receiver of the action." },
      { name: "Present Perfect Passive", example: "I have been bossed around.", description: "Receiver focus for actions with current relevance." },
    ]
  },
  {
    category: "Modals & Forms",
    icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
    items: [
      { name: "Modal Can", example: "I can be bossed around.", description: "Ability or possibility." },
      { name: "Modal Could", example: "I could be bossed around.", description: "Past ability or possibility." },
      { name: "Modal Should", example: "I should be bossed around.", description: "Advice or obligation." },
      { name: "Modal Must", example: "I must be bossed around.", description: "Strong necessity or deduction." },
      { name: "Modal Might", example: "I might be bossed around.", description: "Low probability." },
      { name: "Modal May", example: "I may be bossed around.", description: "Permission or possibility." },
      { name: "Modal Would", example: "I would be bossed around.", description: "Hypothetical situations." },
      { name: "Gerund Form", example: "Being bossed around is...", description: "Using the verb as a noun." },
      { name: "Infinitive Form", example: "To be bossed around is...", description: "Base form of the verb." },
      { name: "Imperative", example: "Be bossed around!", description: "Commands or direct instructions." },
      { name: "Subjunctive", example: "It is necessary that I be bossed around.", description: "Hypotheticals, wishes, or demands." },
    ]
  },
  {
    category: "Advanced Structures",
    icon: <AlertCircle className="w-5 h-5 text-red-400" />,
    items: [
      { name: "Question Form", example: "Am I being bossed around?", description: "Inversion for inquiry." },
      { name: "Negative Form", example: "I am not being bossed around.", description: "Denial of the action." },
      { name: "Relative Clause", example: "I who am being bossed around...", description: "Adding detail to a noun." },
      { name: "Reported Speech", example: "He said he was being bossed around.", description: "Relating what someone else said." },
    ]
  },
  {
    category: "Future Tenses",
    icon: <BookOpen className="w-5 h-5 text-green-400" />,
    items: [
      { name: "Future Simple", example: "I will be bossed around by my boss.", description: "Predictions or spontaneous decisions." },
      { name: "Future Continuous", example: "I will be being bossed around by my boss.", description: "Actions that will be in progress in the future." },
      { name: "Future Perfect", example: "I will have been bossed around by my boss.", description: "Action completed by a future point." },
      { name: "Future Perfect Continuous", example: "I will have been being bossed around by my boss.", description: "Ongoing action up to a future point." },
      { name: "Future Passive", example: "I will be bossed around.", description: "Future receiver focus." },
      { name: "Future Perfect Passive", example: "I will have been bossed around.", description: "Future completion with receiver focus." },
    ]
  },
  {
    category: "Conditionals",
    icon: <Zap className="w-5 h-5 text-orange-400" />,
    items: [
      { name: "Conditional 0", example: "I would be bossed around.", description: "General truths (often used with 'if')." },
      { name: "Conditional 1", example: "I would have been bossed around.", description: "Possible future outcomes." },
      { name: "Conditional 2", example: "I would be being bossed around.", description: "Hypothetical present/future." },
      { name: "Conditional 3", example: "I would have been being bossed around.", description: "Hypothetical past." },
      { name: "Conditional Mixed", example: "I would have been bossed around.", description: "Past condition affecting the present." },
    ]
  }
];

export const GrammarSection = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-12">
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight gradient-text">Grammar Mastery</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          A comprehensive guide to English verbal structures. Use these examples to understand how expressions adapt across time and context.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GRAMMAR_DATA.map((section, idx) => (
          <motion.section
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              {section.icon}
              <h3 className="text-lg font-bold text-zinc-200">{section.category}</h3>
            </div>
            
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.name} className="group space-y-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-zinc-200 font-medium italic bg-white/5 p-3 rounded-2xl border border-white/5">
                    "{item.example}"
                  </p>
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-tight">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};
