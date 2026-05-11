"use client";

import { motion } from "framer-motion";
import { Lightbulb, Image as ImageIcon } from "lucide-react";

interface VisualCardProps {
  imageUrl?: string;
  mnemonic?: string;
  text: string;
}

export function VisualCard({ imageUrl, mnemonic, text }: VisualCardProps) {
  return (
    <div className="w-full">
      {/* Mnemonic Section */}
      <div className="glass rounded-[3rem] p-10 flex flex-col justify-center relative overflow-hidden border border-white/10 min-h-[200px]">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-blue-500">
          <Lightbulb size={160} />
        </div>
        <div className="relative space-y-6 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Lightbulb size={24} />
            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Memory Trick</h3>
          </div>
          <p className="text-zinc-200 text-2xl md:text-3xl font-medium leading-tight italic">
            "{mnemonic || "Try creating a mental image of this expression in a funny situation!"}"
          </p>
          <div className="h-1.5 w-24 bg-blue-500 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
  );
}
