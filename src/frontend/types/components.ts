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

export interface ReviewHeaderProps {
  currentReviewIndex: number;
  queueLength: number;
  cefr: string;
  isTestMode: boolean;
  toggleTestMode: () => void;
  endReview: () => void;
}

export interface ReviewProgressBarProps {
  progress: number;
}

export interface RatingButtonsProps {
  onRate: (performance: import("@/frontend/types/store").StudyPerformance) => void;
  isSubmitting: boolean;
}

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

export interface AnalysisLoadingProps {
  streamedText: string;
}

export interface TransitivityCardProps {
  details: import("@/shared/types/expression").PhrasalVerbDetails;
}

export interface SeparabilityCardProps {
  details: import("@/shared/types/expression").PhrasalVerbDetails;
}

export interface SyntaxAnatomyProps {
  details: import("@/shared/types/expression").PhrasalVerbDetails;
}

export interface UsageLogicSectionProps {
  details: import("@/shared/types/expression").PhrasalVerbDetails;
}

export interface LogicDocumentationProps {
  details: import("@/shared/types/expression").PhrasalVerbDetails | null;
}

export interface NuanceDeepDiveModalProps {
  isOpen: boolean;
  variant: WordVariant | null;
  onClose: () => void;
}

export interface CollapsiblePanelProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
