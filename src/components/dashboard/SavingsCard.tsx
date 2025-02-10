
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SavingsCardProps {
  totalMonthlySavings: number;
  savingsGoal: number;
}

export const SavingsCard = ({ totalMonthlySavings, savingsGoal }: SavingsCardProps) => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data;
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

  const paletteToProgress: Record<string, string> = {
    default: "bg-blue-500",
    ocean: "bg-sky-500",
    forest: "bg-green-500",
    sunset: "bg-orange-500",
    candy: "bg-pink-400",
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Objectif d'épargne</CardTitle>
        <CardDescription>Progression mensuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className={`text-3xl font-bold ${paletteToText[colorPalette]}`}>
            {Math.round(totalMonthlySavings)} € / {Math.round(savingsGoal)} €
          </p>
          <Progress
            value={savingsGoal > 0 ? (totalMonthlySavings / savingsGoal) * 100 : 0}
            className={`${paletteToProgress[colorPalette]}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};
