
import { BarChartBig, Calendar, Clock } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExpensesChartHeaderProps {
  title: string;
  description: string;
  showMultiYear: boolean;
  onToggleView: () => void;
  isVehicleSold?: boolean;
}

export const ExpensesChartHeader = ({
  title,
  description,
  showMultiYear,
  onToggleView,
  isVehicleSold = false
}: ExpensesChartHeaderProps) => {
  return <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-200 mb-1">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{description}</CardDescription>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleView} 
              className={cn(
                "transition-colors",
                // Light mode
                showMultiYear ? "bg-gray-100 border-gray-200 text-gray-700" : "",
                // Dark mode
                showMultiYear ? "dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300" : "",
                // Désactiver le bouton si le véhicule est vendu
                isVehicleSold && "opacity-60 cursor-not-allowed"
              )}
              disabled={isVehicleSold}
            >
              {showMultiYear ? <>
                <Clock className="h-4 w-4 mr-1" />
                5 ans
              </> : <>
                <Calendar className="h-4 w-4 mr-1" />
                Année
              </>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isVehicleSold 
              ? "Les données sont en lecture seule pour un véhicule vendu" 
              : (showMultiYear ? "Voir les dépenses mensuelles de l'année en cours" : "Voir les dépenses sur les 5 dernières années")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
};
