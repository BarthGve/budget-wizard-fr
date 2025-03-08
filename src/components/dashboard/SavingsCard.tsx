
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { memo } from "react";

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
    <Card 
      className="bg-background cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate("/savings")}
    >
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between ">
            <CardTitle className="text-2xl">Epargne</CardTitle>
            <PiggyBank className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Suivi d'objectif</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-x-4">
            <div className="whitespace-nowrap font-bold text-xl flex items-center gap-x-1">
              <span>{Math.round(totalMonthlySavings)} €</span>
            </div>
            <Progress
              value={progressPercentage}
              className="flex-grow"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Cible : {Math.round(savingsGoal)} €</span>
            <span>
              Reste : <span className={`font-medium ${isGoalReached ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                {remainingAmount} €
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Nom d'affichage pour le débogage
SavingsCard.displayName = "SavingsCard";
