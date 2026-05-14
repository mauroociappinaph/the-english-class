import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TagChipProps, TagVariant } from '@/frontend/types/ui';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VARIANT_STYLES: Record<TagVariant, string> = {
  blue: 'bg-blue-500/5 border-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/5 border-purple-500/10 text-purple-400',
  emerald: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/5 border-amber-500/10 text-amber-400',
  zinc: 'bg-zinc-900 border-white/5 text-zinc-500',
  red: 'bg-red-500/5 border-red-500/10 text-red-400',
  white: 'bg-white/10 border-white/20 text-white',
  glass: 'bg-white/5 border-white/5 text-white/50',
};

export function TagChip({ 
  children, 
  variant = 'zinc', 
  className 
}: TagChipProps) {
  return (
    <span className={cn(
      "px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-300",
      VARIANT_STYLES[variant],
      className
    )}>
      {children}
    </span>
  );
}
