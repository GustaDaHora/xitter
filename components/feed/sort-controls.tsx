import { Button } from "@/components/ui/button";
import { SortOption } from "@/types";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { key: "recent" as SortOption, label: "Recent", icon: Clock },
  { key: "highest-iq" as SortOption, label: "Highest IQ", icon: TrendingUp },
  { key: "lowest-iq" as SortOption, label: "Lowest IQ", icon: TrendingDown },
];

export function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2 p-4 bg-card border border-border rounded-xl">
      <span className="text-sm text-muted-foreground font-medium mr-2">
        Sort by:
      </span>
      {sortOptions.map((option) => (
        <Button
          key={option.key}
          variant={currentSort === option.key ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onSortChange(option.key)}
          className={cn(
            "gap-2 transition-all duration-200",
            currentSort === option.key &&
              "bg-primary/10 text-primary border border-primary/20"
          )}
        >
          <option.icon className="h-4 w-4" />
          {option.label}
        </Button>
      ))}
    </div>
  );
}
