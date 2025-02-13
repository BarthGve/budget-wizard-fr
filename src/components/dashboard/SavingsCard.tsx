import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
interface SavingsCardProps {
  totalMonthlySavings: number;
  savingsGoal: number;
}
export const SavingsCard = ({
  totalMonthlySavings,
  savingsGoal
}: SavingsCardProps) => {
  return <Card className="bg-white py-0 my-[2px]">
      <CardHeader className="py-[16px]">
        <CardTitle>Objectif d'épargne</CardTitle>
        <CardDescription>Progression mensuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-bold text-2xl">
            <span className="text-primary">{Math.round(totalMonthlySavings)} €</span>
            {" "}/{" "}
            <span>{Math.round(savingsGoal)} €</span>
          </p>
          <Progress value={savingsGoal > 0 ? totalMonthlySavings / savingsGoal * 100 : 0} className="h-2 [&>div]:bg-primary bg-primary-400" />
        </div>
      </CardContent>
    </Card>;
};