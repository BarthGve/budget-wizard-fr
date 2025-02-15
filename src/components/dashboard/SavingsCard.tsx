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
        <CardTitle className="text-2xl">Objectif d'épargne</CardTitle>
        <CardDescription>Progression mensuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-bold text-xl">
            <span className="text-primary text-xl">{Math.round(totalMonthlySavings)} €</span>
            {" "}/{" "}
            <span className="text-xl">{Math.round(savingsGoal)} €</span>
          </p>
          <Progress value={savingsGoal > 0 ? totalMonthlySavings / savingsGoal * 100 : 0} className="h-2 bg-slate-400 [&>div]:bg-primary" />
        </div>
      </CardContent>
    </Card>;
};