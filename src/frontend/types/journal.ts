import { JournalEntry, LinguisticAnalysis } from '@/shared/types/journal';

export interface JournalEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isSaving: boolean;
}

export interface FeedbackSummaryProps {
  analysis: LinguisticAnalysis;
}
