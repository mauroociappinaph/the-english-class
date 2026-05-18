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

export interface ExpressionLibraryProps {}

export interface InteractiveTextProps {
  text: string;
  translation: string;
  className?: string;
  label?: string;
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

export interface TagListProps {
  tags: string[];
  limit?: number;
  variant?: 'zinc' | 'blue' | 'purple' | 'glass' | 'emerald';
  showCount?: boolean;
  className?: string;
  tagClassName?: string;
}

export interface PedagogicalEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  suggestion?: {
    text: string;
    action: string;
  };
  illustrationPath?: string;
  onAction?: (action: string) => void;
}

export interface AnalysisErrorCardProps {
  error: import('@/shared/types/analysis').AnalysisError;
  onRetry: () => void;
  onClear: () => void;
}

export interface FlashcardProps {
  isFlipped: boolean;
  onFlip: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  disableFlipClick?: boolean;
}
