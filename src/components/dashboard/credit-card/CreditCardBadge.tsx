
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CreditCardBadgeProps {
  tauxEndettement: number;
  badgeVariant: "default" | "secondary" | "destructive";
  currentView: "monthly" | "yearly";
}

/**
 * Composant qui affiche le badge de taux d'endettement
 */
export const CreditCardBadge = ({
  tauxEndettement,
  badgeVariant,
  currentView
}: CreditCardBadgeProps) => {
  const getStatusIcon = (taux: number) => {
    if (taux < 30) return <CheckCircle className="h-4 w-4 text-white" />;
    if (taux < 40) return <Info className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
    return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
  };

  return (
    <Badge 
      variant={badgeVariant} 
      className={cn(
        "bg-purple-500 px-3 py-1 flex items-center gap-1",
        // Améliorer la visibilité des badges en dark mode
        "dark:bg-opacity-90 dark:font-medium"
      )}
    >
      {getStatusIcon(tauxEndettement)}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <span className="text-xs">{Math.round(tauxEndettement)}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="dark:bg-gray-800 dark:border-gray-700">
          <p className="flex items-center gap-1 dark:text-white">
            <Info className="h-4 w-4" />
            Taux d'endettement {currentView === "monthly" ? "mensuel" : "annuel"}
          </p>
        </TooltipContent>
      </Tooltip>
    </Badge>
  );
};
