
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackTriggerProps {
  collapsed?: boolean;
  onClick: () => void;
}

export const FeedbackTrigger = ({ collapsed, onClick }: FeedbackTriggerProps) => {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "group relative w-full text-primary flex items-center px-4 py-2 rounded-lg transition-colors",
        "hover:bg-primary/10",
        collapsed && "justify-center px-0",
        !collapsed && "justify-start"
      )}
    >
      <MessageSquare className={cn(
        "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
        !collapsed && "mr-2"
      )} />
      {!collapsed && (
        <span className="truncate">Votre avis</span>
      )}
    </Button>
  );
};
