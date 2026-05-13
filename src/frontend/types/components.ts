import { Expression, RegionalVariant } from './store';
import React from 'react';
import { WordFamilies, PhrasalVerbDetails, WordVariant } from '@/shared/types/expression';
import { LucideIcon } from 'lucide-react';

export interface GrammarItem {
  name: string;
  example: string;
  description: string;
}

export interface GrammarSectionProps {
  category: string;
  icon: React.ReactNode;
  items: GrammarItem[];
}

export interface SlangComparePanelProps {
  variants: RegionalVariant[];
}

export interface CompareColumnProps {
  variant: RegionalVariant;
  slot: 0 | 1;
}

export interface SlangFiltersProps {
  availableRegions?: string[];
  totalResults: number;
}

export interface SimilarWordsProps {
  words: string[];
  limit?: number;
}

export interface SlangRegionCardProps {
  variant: RegionalVariant;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface ExpressionLibraryProps {
  expressions: Expression[];
  getCefrStyle: (level: string) => { bg: string; glow: string };
  onDelete: (id: string) => Promise<void>;
  onViewDetail: (ex: Expression) => void;
}

export interface InteractiveTextProps {
  text: string;
  translation: string;
  className?: string;
}

export interface SearchBarProps {
  input: string;
  setInput: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isAnalyzing: boolean;
}

export interface TenseTimelineProps {
  tenses?: Record<string, { text: string; translation: string }> | null;
}

export interface WordFamilyListProps {
  families: WordFamilies;
}

export interface WordVariantCardProps {
  variant: WordVariant;
  category: {
    label: string;
    sub: string;
    color: string;
    icon: LucideIcon;
  };
  index: number;
}

export interface PhrasalVerbDetailsProps {
  details: PhrasalVerbDetails;
}
