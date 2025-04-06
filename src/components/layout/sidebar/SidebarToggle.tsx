
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  collapsed: boolean;
  onClick: () => void;
}

export const SidebarToggle = ({ collapsed, onClick }: SidebarToggleProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="icon"
      className={cn(
        "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-sm",
        collapsed ? "rotate-180" : "rotate-0"
      )}
    >
      <ChevronLeft className="h-3.5 w-3.5" />
      <span className="sr-only">
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </span>
    </Button>
  );
};
