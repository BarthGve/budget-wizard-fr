
import { Button } from "@/components/ui/button";
import { LightbulbIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionTriggerProps {
  collapsed?: boolean;
  onClick: () => void;
}

export const ContributionTrigger = ({ collapsed, onClick }: ContributionTriggerProps) => {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "group relative w-full flex items-center px-4 py-2 rounded-lg transition-colors",
        "hover:bg-primary/10",
        collapsed && "justify-center px-0",
        !collapsed && "justify-start"
      )}
    >
      <LightbulbIcon className={cn(
        "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
        !collapsed && "mr-2"
      )} />
      {!collapsed && (
        <span className="truncate">Contribuer au projet</span>
      )}
    </Button>
  );
};
