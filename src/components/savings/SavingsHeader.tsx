import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
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
    <motion.div 
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <Card className="h-full overflow-hidden border shadow-sm">
        <CardHeader className="pb-2">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={cn(
                "p-2.5 rounded-lg shadow-sm",
                // Light mode
                "bg-gradient-to-br from-emerald-100 to-emerald-50",
                // Dark mode
                "dark:bg-gradient-to-br dark:from-emerald-900/40 dark:to-emerald-800/30 dark:shadow-emerald-900/10"
              )}
            >
              <Target className={cn(
                "h-5 w-5",
                "text-emerald-600",
                "dark:text-emerald-400"
              )} />
            </motion.div>
            
            <div>
              <CardTitle className={cn(
                "text-xl font-bold bg-clip-text text-transparent",
                // Light mode gradient
                "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500",
                // Dark mode gradient
                "dark:bg-gradient-to-r dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400"
              )}>
                Objectif d'épargne
              </CardTitle>
              <CardDescription className={cn(
                "text-sm mt-0.5",
                "text-gray-500",
                "dark:text-gray-400"
              )}>
                Définissez le pourcentage de vos revenus à épargner
              </CardDescription>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-5 pt-3">
          {/* Slider section */}
          <motion.div 
            className="space-y-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Pourcentage d'épargne</Label>
              <span className={cn(
                "text-sm font-medium px-2 py-0.5 rounded-md",
                // Light mode
                "bg-emerald-50 text-emerald-700",
                // Dark mode
                "dark:bg-emerald-900/30 dark:text-emerald-300"
              )}>
                {localPercentage}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[localPercentage]}
              onValueChange={handleValueChange}
              onValueCommit={handleValueCommit}
              className="text-emerald-500 dark:text-emerald-400"
              aria-label="Pourcentage d'épargne"
            />
          </motion.div>
  
          {/* Card sur fond gris */}
          <motion.div 
            className={cn(
              "space-y-3.5 rounded-lg border p-4",
              // Light mode
              "bg-gradient-to-b from-gray-50 to-gray-100/80 border-gray-200/70",
              // Dark mode
              "dark:bg-gradient-to-b dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 8px -2px rgba(0, 0, 0, 0.15)"
                : "0 2px 8px -2px rgba(0, 0, 0, 0.05)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {/* Barre de progression */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-xs text-muted-foreground">Progression vers l'objectif</span>
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  isTargetMet ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                )}>
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full transition-all duration-500",
                    isTargetMet 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500"
                      : "bg-gradient-to-r from-amber-400 to-emerald-400 dark:from-amber-500 dark:to-emerald-500"
                  )}
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <motion.div 
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <span className="text-muted-foreground">Objectif mensuel</span>
              <span className={cn(
                "font-medium px-2 py-0.5 rounded",
                "bg-emerald-50 text-emerald-700",
                "dark:bg-emerald-900/30 dark:text-emerald-300"
              )}>{targetMonthlySavings.toFixed(0)}€</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <span className="text-muted-foreground">Total épargné</span>
              <span className="font-medium">{totalMonthlyAmount.toFixed(0)}€</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700/50 mt-2 pt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <span className="text-muted-foreground">Reste à épargner</span>
              <span className={cn(
                "font-medium px-2 py-0.5 rounded",
                isTargetMet 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              )}>
                {Math.abs(remainingToTarget).toFixed(0)}€ {isTargetMet ? 'dépassé' : 'manquant'}
              </span>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
