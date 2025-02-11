
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SavingsGoalProps {
  savingsPercentage: number;
  totalMonthlyAmount: number;
}

export const SavingsGoal = ({
  savingsPercentage,
  totalMonthlyAmount,
}: SavingsGoalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const { data: contributors } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const colorPalette = profile?.color_palette || "default";
  const paletteToText: Record<string, string> = {
    default: "text-blue-500",
    ocean: "text-sky-500",
    forest: "text-green-500",
    sunset: "text-orange-500",
    candy: "text-pink-400",
  };

  const totalIncome = contributors?.reduce(
    (acc, contributor) => acc + contributor.total_contribution,
    0
  ) || 0;

  const updateSavingsPercentage = async (newValue: number[]) => {
    const value = newValue[0];
    if (value === savingsPercentage) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ savings_goal_percentage: value })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre objectif d'épargne",
        variant: "destructive",
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["profile"] });
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
          <Target className={`h-5 w-5 ${paletteToText[colorPalette]}`} />
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
            <div className="px-1">
              <Slider
                value={[savingsPercentage]}
                onValueChange={updateSavingsPercentage}
                onValueCommit={updateSavingsPercentage}
                max={100}
                step={1}
                className={paletteToText[colorPalette]}
              />
            </div>
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

