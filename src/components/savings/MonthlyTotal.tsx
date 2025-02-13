import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
interface MonthlyTotalProps {
  totalMonthlyAmount: number;
}
export const MonthlyTotal = ({
  totalMonthlyAmount
}: MonthlyTotalProps) => {
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      return data;
    }
  });
  const colorPalette = profile?.color_palette || "default";
  const paletteToColor: Record<string, string> = {
    default: "text-blue-500",
    ocean: "text-sky-500",
    forest: "text-green-500",
    sunset: "text-orange-500",
    candy: "text-pink-400"
  };
  return <Card className="py-0 my-[63px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          <CardTitle>Total mensuel</CardTitle>
        </div>
        <CardDescription>
          Montant total de vos versements mensuels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-4xl text-primary font-bold">{totalMonthlyAmount}€</p>
          <p className="text-sm text-muted-foreground mt-2">par mois</p>
        </div>
      </CardContent>
    </Card>;
};