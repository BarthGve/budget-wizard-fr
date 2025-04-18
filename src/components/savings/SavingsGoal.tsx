
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  const [localPercentage, setLocalPercentage] = useState(savingsPercentage);
  
  // Synchroniser le state local avec les props
  useEffect(() => {
    setLocalPercentage(savingsPercentage);
  }, [savingsPercentage]);

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

  const handleValueChange = (newValue: number[]) => {
    setLocalPercentage(newValue[0]);
  };

  const handleValueCommit = async (newValue: number[]) => {
    const value = newValue[0];
    if (value === savingsPercentage) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ savings_goal_percentage: value })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Invalidation ciblée des queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
      ]);
      
      toast({
        title: "Succès",
        description: "Votre objectif d'épargne a été mis à jour",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'objectif:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre objectif d'épargne: " + (error.message || "Erreur inconnue"),
        variant: "destructive",
      });
      setLocalPercentage(savingsPercentage);
    }
  };

  const totalIncome = contributors?.reduce(
    (acc, contributor) => acc + contributor.total_contribution,
    0
  ) || 0;

  const targetMonthlySavings = (totalIncome * localPercentage) / 100;
  const remainingToTarget = targetMonthlySavings - totalMonthlyAmount;
  const isTargetMet = remainingToTarget <= 0;
  const progressPercentage = Math.min(totalMonthlyAmount / targetMonthlySavings * 100, 100);

  return (
    <div className="h-full">
      <Card className={cn(
        "h-full transition-all duration-300",
        // Light mode - fond blanc avec effet d'ombre élégant
        "bg-white border border-gray-200/60 shadow-lg",
        // Dark mode - fond adapté avec effet d'ombre verdâtre, identique à la carte graphique
        "dark:bg-gray-900/90 dark:border-quaternary-900/30 dark:shadow-quaternary-900/20"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-quaternary-100 dark:bg-quaternary-900/30">
              <Target className="h-4 w-4 text-quaternary-600 dark:text-quaternary-400" />
            </div>
            <CardTitle className="text-lg font-medium">Objectif d'épargne</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Définissez le pourcentage de vos revenus à épargner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-1">
          {/* Slider section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Pourcentage d'épargne</Label>
              <span className="text-sm font-medium text-quaternary-600 dark:text-quaternary-400">{localPercentage}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[localPercentage]}
              onValueChange={handleValueChange}
              onValueCommit={handleValueCommit}
                rangeClassName="bg-quaternary-500 dark:bg-quaternary-400"
          thumbClassName="border-2 border-quaternary bg-background hover:bg-quaternary" 
              className="text-quaternary-500 dark:text-quaternary-400"
              aria-label="Pourcentage d'épargne"
            />
          </div>
  
          {/* Card sur fond gris */}
          <div className="space-y-2 rounded-lg bg-secondary/50 border border-border/50 p-2">
            {/* Barre de progression */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Progression vers l'objectif</span>
                <span className="text-xs font-medium">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isTargetMet ? 'bg-quaternary-500' : 'bg-quaternary-400/80'} transition-all duration-300 ease-out`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Objectif mensuel</span>
              <span className="font-medium text-quaternary-600 dark:text-quaternary-400">{targetMonthlySavings.toFixed(0)}€</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total épargné</span>
              <span className="font-medium">{totalMonthlyAmount.toFixed(0)}€</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-border/40 mt-1 pt-2">
              <span className="text-muted-foreground">Reste à épargner</span>
              <span className={`font-medium ${isTargetMet ? 'text-quaternary-600 dark:text-quaternary-400' : 'text-destructive'}`}>
                {Math.abs(remainingToTarget).toFixed(0)}€ {isTargetMet ? 'dépassé' : 'manquant'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
