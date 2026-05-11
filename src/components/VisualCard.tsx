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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Image Section */}
      <div className="glass rounded-[2rem] overflow-hidden aspect-video relative group border border-white/10">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={text} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-white/5 text-zinc-600">
              <ImageIcon size={40} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Mnemonic Section */}
      <div className="glass rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500">
          <Lightbulb size={120} />
        </div>
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Lightbulb size={20} />
            <h3 className="text-xs font-black uppercase tracking-widest">Memory Trick</h3>
          </div>
          <p className="text-zinc-200 text-xl font-medium leading-relaxed italic">
            {mnemonic || "Try creating a mental image of this expression in a funny situation!"}
          </p>
          <div className="h-1 w-12 bg-blue-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
