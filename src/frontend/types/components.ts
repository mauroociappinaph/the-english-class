import { Expression } from './store';

export interface AnalysisResultProps {
  currentAnalysis: Expression | any;
  getCefrStyle: (level: string) => { bg: string; glow: string };
}

export interface ExpressionLibraryProps {
  expressions: Expression[];
  getCefrStyle: (level: string) => { bg: string; glow: string };
  onDelete: (id: string) => Promise<void>;
  onViewDetail: (ex: any) => void;
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
  tenses: Record<string, { text: string; translation: string }>;
}


export interface VisualCardProps {
  imageUrl?: string;
  mnemonic: string;
  text: string;
}

