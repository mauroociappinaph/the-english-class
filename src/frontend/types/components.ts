import { Expression } from './store';

export interface AnalysisResultProps {
  currentAnalysis: Expression | null;
  getCefrStyle: (level: string) => { bg: string; glow: string };
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

export interface VisualCardProps {
  imageUrl?: string | null;
  mnemonic?: string | null;
  text: string;
}

export interface WordFamilyListProps {
  families: {
    noun?: string[];
    verb?: string[];
    adjective?: string[];
    adverb?: string[];
  };
}
