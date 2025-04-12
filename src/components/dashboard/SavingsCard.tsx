
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

// Utilisation de memo pour éviter les re-rendus inutiles
export const SavingsCard = memo(({
  totalMonthlySavings,
  savingsGoal
}: SavingsCardProps) => {
  const navigate = useNavigate();

  // Calculs pour la barre de progression
  const progressPercentage = savingsGoal > 0 ? Math.min(100, (totalMonthlySavings / savingsGoal) * 100) : 0;
  const remainingAmount = Math.max(0, Math.round(savingsGoal - totalMonthlySavings));
  const isGoalReached = (savingsGoal - totalMonthlySavings) <= 0;

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
          // Light mode styles with primary color
          "bg-primary/10 shadow-lg border border-primary/20 hover:shadow-xl",
          // Dark mode styles with primary color
          "dark:bg-primary/10 dark:border-primary/30 dark:shadow-primary/30 dark:hover:shadow-primary/50"
        )}
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-primary/20 text-primary", // Apply primary color for icon background
                "dark:bg-primary/20 dark:text-primary" // Dark mode variant
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
            <div className="flex items-center gap-2">
              <motion.p 
                className={cn(
                  "text-xl font-bold leading-none w-1/3",
                  "text-gray-800", // Light mode text color
                  "dark:text-primary" // Dark mode text color using primary
                )}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                {Math.round(totalMonthlySavings).toLocaleString('fr-FR')} €
              </motion.p>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-2/3 relative">
                    <div className={cn(
                      "absolute inset-0 bg-primary/10 blur-sm rounded-full opacity-0 dark:opacity-60", 
                      isGoalReached ? "dark:bg-primary/10" : "" // Change intensity based on goal
                    )} />
                    
                    <Progress 
                      value={progressPercentage} 
                      className={cn(
                        "h-2.5 rounded-full",
                        "bg-primary/50", // Light mode progress background using primary
                        "dark:bg-primary/70" // Dark mode progress background using primary
                      )}
                      indicatorClassName={cn(
                        "bg-primary", // Indicator color using primary
                        isGoalReached ? "dark:bg-primary/40" : "dark:bg-primary"
                      )}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700 p-3">
                  <p className="flex items-center gap-1.5 dark:text-white font-medium">
                    <Info className="h-4 w-4 text-primary dark:text-primary" />
                    {Math.round(progressPercentage)}% de l'objectif atteint
                  </p>
                  <span className="dark:text-gray-300 mt-1 block">
                    {isGoalReached ? (
                      <span className="font-medium text-primary dark:text-primary">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
// Nom d'affichage pour le débogage
SavingsCard.displayName = "SavingsCard";
