import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const remainingAmount = Math.max(0, Math.round(savingsGoal - totalMonthlySavings));
  const isGoalReached = (savingsGoal - totalMonthlySavings) <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <Card 
        className={cn(
          "backdrop-blur-lg cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-background/90 to-green-50/90 shadow-md hover:shadow-lg border-green-100/50",
          "dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-green-950/90 dark:border-green-800/20 dark:shadow-green-900/20"
        )}
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                "bg-green-100 text-green-600",
                "dark:bg-green-900/50 dark:text-green-300"
              )}>
                <PiggyBank className="h-4 w-4" />
              </div>
              <span className="dark:text-white">Epargne</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="relative">
              <motion.p 
                className={cn(
                  "font-bold text-2xl",
                  "text-gray-800",
                  "dark:text-green-50"
                )}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              >
                {Math.round(totalMonthlySavings).toLocaleString('fr-FR')} €
              </motion.p>
              
              <div className="absolute -inset-1 bg-green-500/10 blur-md rounded-full opacity-0 dark:opacity-40" />
              
              <p className={cn(
                "text-xs mb-2 mt-1",
                "text-gray-500",
                "dark:text-gray-400"
              )}>
                Suivi d'objectif
              </p>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative pt-1">
                  <div className={cn(
                    "absolute inset-0 bg-green-500/10 rounded-full blur-sm",
                    "opacity-0 dark:opacity-60 transition-opacity",
                    isGoalReached ? "dark:bg-green-300/20" : ""
                  )} />
                  
                  <Progress 
                    value={progressPercentage} 
                    className={cn(
                      "h-2 rounded-full",
                      "bg-green-100/50",
                      "dark:bg-green-950/70"
                    )}
                    indicatorClassName={cn(
                      isGoalReached ? "bg-green-500" : "bg-green-500", 
                      isGoalReached ? "dark:bg-green-400" : "dark:bg-green-500"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="dark:bg-gray-800 dark:border-gray-700 p-2">
                <p className="flex items-center gap-1.5 dark:text-white font-medium">
                  <Info className="h-4 w-4 text-green-500 dark:text-green-400" />
                  {Math.round(progressPercentage)}% de l'objectif atteint
                </p>
                <span className="dark:text-gray-300 mt-1 block text-sm">
                  {isGoalReached ? (
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Objectif atteint ! (+{Math.abs(remainingAmount).toLocaleString('fr-FR')} €)
                    </span>
                  ) : (
                    <>
                      Reste : <span className="font-medium text-red-600 dark:text-red-400">
                        {remainingAmount.toLocaleString('fr-FR')} €
                      </span>
                    </>
                  )}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SavingsCard.displayName = "SavingsCard";