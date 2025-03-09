
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
          "backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-300",
          // Light mode styles
          "bg-gradient-to-br from-background to-green-50 border border-green-100 shadow-md",
          // Dark mode styles
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-green-950 dark:border-green-900/50 dark:shadow-green-900/10"
        )}
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-green-100 text-green-600", // Light mode
                "dark:bg-green-900/40 dark:text-green-400" // Dark mode
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
                  "text-gray-800", // Light mode
                  "dark:text-gray-100" // Dark mode
                )}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                {Math.round(totalMonthlySavings).toLocaleString('fr-FR')} €
              </motion.p>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-2/3">
                    <Progress 
                      value={progressPercentage} 
                      className={cn(
                        "h-2.5 rounded-full",
                        // Light mode - progress background
                        "bg-gray-200",
                        // Dark mode - progress background
                        "dark:bg-gray-800"
                      )}
                      // La couleur de l'indicateur de progression
                      style={{
                        '--progress-foreground': isGoalReached 
                          ? 'var(--green-500)' 
                          : 'var(--green-400)'
                      } as React.CSSProperties}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700">
                  <p className="flex items-center gap-1 dark:text-white">
                    <Info className="h-4 w-4" />
                    {Math.round(progressPercentage)}% de l'objectif atteint
                  </p>
                  <span className="dark:text-gray-300">
                    Reste : <span className={cn(
                      "font-medium",
                      isGoalReached ? "text-green-600" : "text-destructive",
                      isGoalReached ? "dark:text-green-400" : "dark:text-red-400"
                    )}>
                      {remainingAmount.toLocaleString('fr-FR')} €
                    </span>
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
