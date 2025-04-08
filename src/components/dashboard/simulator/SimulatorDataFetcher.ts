
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";
import { useAuthContext } from "@/context/AuthProvider";

export const useSimulatorDataFetcher = () => {
  const { user, isAuthenticated } = useAuthContext();

  // Récupérer les crédits
  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ["simulator-credits"],
    queryFn: async () => {
      if (!user || !isAuthenticated) return [];
      
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq("profile_id", user.id)
        .eq("statut", "actif");

      if (error) {
        console.error("Erreur lors de la récupération des crédits:", error);
        return [];
      }

      return data as Credit[];
    },
    enabled: !!user && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculer le total des mensualités de crédit
  const totalCreditPayments = credits?.reduce(
    (sum, credit) => sum + (credit.montant_mensualite || 0),
    0
  ) || 0;

  return {
    totalCreditPayments,
    isLoadingCredits,
  };
};
