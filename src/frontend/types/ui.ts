import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export type TagVariant = "emerald" | "blue" | "purple" | "amber" | "red" | "zinc" | "white" | "glass";

export interface TagChipProps {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
  icon?: LucideIcon;
}
