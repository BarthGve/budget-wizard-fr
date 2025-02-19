
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface SavingsCardProps {
  totalMonthlySavings: number;
  savingsGoal: number;
}

export const SavingsCard = ({
  totalMonthlySavings,
  savingsGoal
}: SavingsCardProps) => {
  const navigate = useNavigate();

  return <Card 
    className="bg-background cursor-pointer hover:bg-accent/10 transition-colors"
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
            value={savingsGoal > 0 ? Math.min(100, (totalMonthlySavings / savingsGoal) * 100) : 0}
            className="flex-grow"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Cible : {Math.round(savingsGoal)} €</span>
          <span>
            Reste : <span className={`font-medium ${(savingsGoal - totalMonthlySavings) <= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
              {Math.max(0, Math.round(savingsGoal - totalMonthlySavings))} €
            </span>
          </span>
        </div>
      </div>
    </CardContent>
  </Card>;
};
