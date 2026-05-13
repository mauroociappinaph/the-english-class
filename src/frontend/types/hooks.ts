export type StreamOptions = {
  type?: 'expression' | 'journal';
  userLevel?: string;
  onFinish?: (fullText: string) => void;
  onError?: (error: Error) => void;
};
