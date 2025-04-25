
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Info, Check, AlertCircle, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getSavingsStatus } from "@/utils/savingsCalculations";

interface SavingsCardProps {
  totalMonthlySavings: number;
  savingsGoal: number;
}

export const SavingsCard = memo(({
  totalMonthlySavings,
  savingsGoal
}: SavingsCardProps) => {
  const navigate = useNavigate();
  const progressPercentage = savingsGoal > 0 ? Math.min(100, (totalMonthlySavings / savingsGoal) * 100) : 0;
  const savingsStatus = getSavingsStatus(totalMonthlySavings, savingsGoal);

  const StatusIcon = () => {
    if (!savingsStatus) return null;
    
    switch (savingsStatus.icon) {
      case 'check':
        return <Check className="h-4 w-4" />;
      case 'alert-circle':
        return <AlertCircle className="h-4 w-4" />;
      case 'x':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Fonction pour déterminer la classe de couleur de la progress bar
  const getProgressBarColor = () => {
    if (!savingsStatus) return "bg-quaternary";
    
    // Extraire le nom de couleur de la classe text-X
    if (savingsStatus.color.includes('green')) {
      return "bg-green-600 dark:bg-green-400";
    } else if (savingsStatus.color.includes('amber')) {
      return "bg-amber-600 dark:bg-amber-400";
    } else if (savingsStatus.color.includes('red')) {
      return "bg-red-600 dark:bg-red-400";
    }
    
    return "bg-quaternary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card 
        className={cn(
          "backdrop-blur-sm cursor-pointer transition-all duration-300",
          "shadow-lg border hover:shadow-xl",
          "dark:bg-quaternary/10 dark:border-quaternary/30 dark:shadow-quaternary/30 dark:hover:shadow-quaternary/50"
        )}
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-quaternary-100 text-quaternary-600",
                "dark:bg-quaternary-900/40 dark:text-quaternary-300"
              )}>
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="dark:text-white">Epargne</span>
            </CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">Suivi d'objectif</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <p className={cn(
                  "text-xl font-bold leading-none",
                  savingsStatus?.color || "text-gray-800 dark:text-quaternary"
                )}>
                  {Math.round(totalMonthlySavings).toLocaleString('fr-FR')} €
                </p>
                {savingsStatus && (
                  <span className={cn("flex items-center", savingsStatus.color)}>
                    <StatusIcon />
                  </span>
                )}
              </motion.div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-2/3 relative">
                    <div className={cn(
                      "absolute inset-0 bg-quaternary/10 blur-sm rounded-full opacity-0 dark:opacity-60"
                    )} />
                    <Progress 
                      value={progressPercentage} 
                      className={cn(
                        "h-2.5 rounded-full",
                        "bg-amber/50",
                        "dark:bg-gray/70"
                      )}
                      indicatorClassName={cn(
                        getProgressBarColor(),
                        "transition-colors duration-300"
                      )}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700 p-3">
                  <p className="flex items-center gap-1.5 dark:text-white font-medium">
                    <Info className="h-4 w-4 text-quaternary dark:text-quaternary" />
                    {savingsStatus?.message || `${Math.round(progressPercentage)}% de l'objectif atteint`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SavingsCard.displayName = "SavingsCard";
