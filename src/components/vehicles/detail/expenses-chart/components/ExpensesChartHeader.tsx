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
}
export const ExpensesChartHeader = ({
  title,
  description,
  showMultiYear,
  onToggleView
}: ExpensesChartHeaderProps) => {
  return <div className="flex justify-between items-start">
      <div>
        
        
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onToggleView} className={cn("transition-colors",
          // Light mode
          showMultiYear ? "bg-blue-50 border-blue-200 text-blue-700" : "",
          // Dark mode
          showMultiYear ? "dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "")}>
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
            {showMultiYear ? "Voir les dépenses mensuelles de l'année en cours" : "Voir les dépenses sur les 5 dernières années"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
};