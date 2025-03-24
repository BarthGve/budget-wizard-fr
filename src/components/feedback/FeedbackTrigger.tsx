
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackTriggerProps {
  collapsed?: boolean;
  onClick: () => void;
}

// Utilisation de forwardRef pour permettre de passer la référence au bouton
export const FeedbackTrigger = forwardRef<HTMLButtonElement, FeedbackTriggerProps>(
  ({ collapsed, onClick }, ref) => {
    return (
      <Button 
        variant="ghost" 
        onClick={onClick}
        ref={ref}
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800/60",
          collapsed && "justify-center py-3",
        )}
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
        </div>
        {!collapsed && (
          <span className="truncate text-gray-600 dark:text-gray-300">
            Laisser un commentaire
          </span>
        )}
      </Button>
    );
  }
);

// Ajout d'un displayName pour faciliter le débogage
FeedbackTrigger.displayName = "FeedbackTrigger";
