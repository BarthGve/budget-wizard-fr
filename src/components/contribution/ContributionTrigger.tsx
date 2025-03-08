
import { Button } from "@/components/ui/button";
import { Gift, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionTriggerProps {
  hasContributed: boolean;
  isCollapsed?: boolean;
}

export const ContributionTrigger = ({ 
  hasContributed,
  isCollapsed
}: ContributionTriggerProps) => {
  return (
    <Button 
      size={isCollapsed ? "icon" : "sm"} 
      className={cn(
        "bg-violet-600 hover:bg-violet-700 text-white font-medium",
        hasContributed && "bg-green-600 hover:bg-green-700"
      )}
    >
      {isCollapsed ? (
        <Gift className="h-4 w-4" />
      ) : (
        <>
          {hasContributed ? "Contribuer à nouveau" : "Contribuer"}
          <Gift className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
};
