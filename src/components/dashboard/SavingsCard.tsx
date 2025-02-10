
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SavingsCardProps {
  totalMonthlySavings: number;
  savingsGoal: number;
}

export const SavingsCard = ({ totalMonthlySavings, savingsGoal }: SavingsCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Objectif d'épargne</CardTitle>
        <CardDescription>Progression mensuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-3xl font-bold">
            {Math.round(totalMonthlySavings)} € / {Math.round(savingsGoal)} €
          </p>
          <Progress
            value={savingsGoal > 0 ? (totalMonthlySavings / savingsGoal) * 100 : 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};
