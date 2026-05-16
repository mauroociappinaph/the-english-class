import { ReactNode } from "react";

export interface FlashcardProps {
  isFlipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  disableFlipClick?: boolean;
}
