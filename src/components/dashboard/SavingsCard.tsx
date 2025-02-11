
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SavingsCardProps {
  totalMonthlySavings: number;
  savingsGoal: number;
}

export const SavingsCard = ({ totalMonthlySavings, savingsGoal }: SavingsCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Objectif d'épargne</CardTitle>
        <CardDescription>Progression mensuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-3xl font-bold">
            <span className="text-green-500">{Math.round(totalMonthlySavings)} €</span>
            {" "}/{" "}
            <span>{Math.round(savingsGoal)} €</span>
          </p>
          <Progress 
            value={savingsGoal > 0 ? (totalMonthlySavings / savingsGoal) * 100 : 0}
            className="h-2 [&>div]:bg-green-500 bg-green-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};
