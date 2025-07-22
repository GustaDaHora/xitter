import { cn } from "@/lib/utils";
import { getIQColor, getIQCategory } from "@/lib/dummy-data";
import { Brain, Zap, Star, Target } from "lucide-react";

interface IQBadgeProps {
  iq: number;
  size?: "sm" | "md" | "lg";
  showCategory?: boolean;
  className?: string;
}

export function IQBadge({
  iq,
  size = "md",
  showCategory = false,
  className,
}: IQBadgeProps) {
  const getIcon = (iq: number) => {
    if (iq >= 180) return Brain;
    if (iq >= 140) return Zap;
    if (iq >= 100) return Star;
    return Target;
  };

  const Icon = getIcon(iq);
  const category = getIQCategory(iq);

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold transition-all duration-300",
        "bg-gradient-to-r from-card to-secondary border border-border",
        "hover:shadow-glow hover:scale-105",
        sizeClasses[size],
        getIQColor(iq),
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{iq}</span>
      {showCategory && (
        <span className="text-xs opacity-80 font-medium">{category}</span>
      )}
    </div>
  );
}
