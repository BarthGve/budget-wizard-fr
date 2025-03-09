
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
        className="bg-gradient-to-br from-background to-green-50 backdrop-blur-sm shadow-lg border border-green-100 cursor-pointer"
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-green-500" />
              Epargne
            </CardTitle>
          </div>
          <CardDescription>Suivi d'objectif</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.p 
                className="text-xl font-bold leading-none text-gray-800 w-1/3"
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
                      className="h-2"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    {Math.round(progressPercentage)}% de l'objectif atteint
                  </p>
                  <span>
                Reste : <span className={`font-medium ${isGoalReached ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
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
