
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface SavingsGoalProps {
  savingsPercentage: number;
  setSavingsPercentage: (value: number) => void;
  totalMonthlyAmount: number;
}

export const SavingsGoal = ({
  savingsPercentage,
  setSavingsPercentage,
  totalMonthlyAmount,
}: SavingsGoalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: contributors } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const totalIncome = contributors?.reduce(
    (acc, contributor) => acc + contributor.total_contribution,
    0
  ) || 0;

  const updateSavingsPercentage = async (value: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ savings_goal_percentage: value })
      .eq("id", session.session.user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre objectif d'épargne",
        variant: "destructive",
      });
      return;
    }

    setSavingsPercentage(value);
    toast({
      title: "Succès",
      description: "Votre objectif d'épargne a été mis à jour",
    });
  };

  const targetMonthlySavings = (totalIncome * savingsPercentage) / 100;
  const remainingToTarget = targetMonthlySavings - totalMonthlyAmount;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Objectif d'épargne</CardTitle>
        </div>
        <CardDescription>
          Définissez le pourcentage de vos revenus à épargner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Pourcentage d'épargne</Label>
              <span className="text-sm font-medium">{savingsPercentage}%</span>
            </div>
            <Slider
              value={[savingsPercentage]}
              onValueChange={(value) => updateSavingsPercentage(value[0])}
              max={100}
              step={1}
            />
          </div>
        </div>
        <div className="space-y-2 rounded-lg bg-secondary p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Revenu total</span>
            <span className="font-medium">{totalIncome.toFixed(2)}€</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Objectif mensuel</span>
            <span className="font-medium">{targetMonthlySavings.toFixed(2)}€</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Total épargné</span>
            <span className="font-medium">{totalMonthlyAmount.toFixed(2)}€</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Reste à épargner</span>
            <span className={`font-medium ${remainingToTarget > 0 ? 'text-destructive' : 'text-green-500'}`}>
              {remainingToTarget.toFixed(2)}€
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
