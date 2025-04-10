
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSimulatorDataFetcher = () => {
  // Calculer le total des mensualités de crédits
  const { data: totalCreditPayments = 0, isLoading: isLoadingCredits } = useQuery({
    queryKey: ["simulator-credit-data"],
    queryFn: async () => {
      const { data: creditsData, error: creditsError } = await supabase
        .from("credits")
        .select("montant_mensualite")
        .eq("statut", "actif");

      if (creditsError) {
        console.error("Erreur lors du chargement des crédits:", creditsError);
        return 0;
      }

      return creditsData.reduce((total, credit) => total + (credit.montant_mensualite || 0), 0);
    },
  });

  return {
    totalCreditPayments,
    isLoadingCredits,
  };
};
