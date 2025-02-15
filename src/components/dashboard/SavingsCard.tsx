import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank } from 'lucide-react';
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
  return   <div className="space-y-4">
  {goals.map((data, index) => {
    const remaining = data.savingsGoal - data.totalMonthlySavings;
    const remainingColor = remaining <= 0 ? 'text-green-600' : 'text-red-600';
    
    return (
      <Card key={index} className="bg-white py-0 my-[2px] w-full max-w-2xl">
        <CardHeader className="py-[16px]">
          <div className="flex items-center gap-x-2">
            <PiggyBank className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl">Objectif d'épargne</CardTitle>
          </div>
          <CardDescription>Progression mensuelle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-x-4">
              <div className="whitespace-nowrap font-bold text-xl flex items-center gap-x-1">
                <span>{Math.round(data.savingsGoal)} €</span>
              </div>
              <Progress
                value={data.savingsGoal > 0 ? (data.totalMonthlySavings / data.savingsGoal) * 100 : 0}
                className="flex-grow h-2 "
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Provisionné : {Math.round(data.totalMonthlySavings)} €</span>
              <span>
                Reste : <span className={`font-medium ${remainingColor}`}>
                  {Math.round(remaining)} €
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  })}
</div>;
};