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
  return <Card className="bg-white py-0 my-[2px]">
  <CardHeader className="py-[16px]">
  <div className="flex items-center gap-x-2">
  <PiggyBank className="w-6 h-6 text-primary" />
    <CardTitle className="text-2xl">Objectif d'épargne</CardTitle>
    </div>
    <CardDescription>Progression mensuelle</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-x-4">
      <div className="whitespace-nowrap font-bold text-xl flex items-center gap-x-1">
        <span className="text-primary">{Math.round(totalMonthlySavings)} €</span>
        <span>/</span>
        <span>{Math.round(savingsGoal)} €</span>
      </div>
      <Progress 
        value={savingsGoal > 0 ? (totalMonthlySavings / savingsGoal) * 100 : 0} 
        className="flex-grow" 
      />
    </div>
  </CardContent>
</Card>;
};