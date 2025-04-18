
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  collapsed: boolean;
  onClick: () => void;
}

export const SidebarToggle = ({ collapsed, onClick }: SidebarToggleProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute -right-3 top-20 p-1.5 rounded-full bg-background border border-border hover:bg-accent transition-colors",
        "z-50 shadow-sm touch-manipulation"
      )}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
};
