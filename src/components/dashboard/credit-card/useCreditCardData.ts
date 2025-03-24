
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";

interface CreditCardDataProps {
  totalMensualites: number;
  totalRevenue: number;
  currentView: "monthly" | "yearly";
}

/**
 * Hook qui gère la logique de calcul pour la carte de crédit
 */
export const useCreditCardData = ({
  totalMensualites,
  totalRevenue,
  currentView
}: CreditCardDataProps) => {
  // Récupérer les crédits pour calculer le montant annuel précis
  const { data: credits = [] } = useQuery({
    queryKey: ["credits-for-dashboard"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq('profile_id', user.id)
        .eq('statut', 'actif');
      
      if (error) {
        console.error("Erreur lors du chargement des crédits:", error);
        return [];
      }
      
      return data as Credit[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Calculer le montant total des mensualités en fonction de la vue
  const totalAmount = useMemo(() => {
    if (currentView === "monthly") {
      return totalMensualites;
    } else {
      // Pour la vue annuelle, calculer le montant en tenant compte des crédits qui se terminent pendant l'année
      const currentYear = new Date().getFullYear();
      const lastDayOfYear = new Date(currentYear, 11, 31); // 31 décembre de l'année en cours
      
      return credits.reduce((total, credit) => {
        const derniereMensualite = new Date(credit.date_derniere_mensualite);
        
        // Si le crédit se termine cette année
        if (derniereMensualite.getFullYear() === currentYear) {
          // Calculer combien de mois restants dans l'année pour ce crédit
          const moisRestants = (derniereMensualite.getMonth() - new Date().getMonth()) + 1;
          // Ajouter le montant des mensualités restantes
          return total + (credit.montant_mensualite * Math.max(0, moisRestants));
        } else if (derniereMensualite > lastDayOfYear) {
          // Si le crédit continue après cette année, ajouter le montant pour tous les mois restants de l'année
          const moisRestants = 12 - new Date().getMonth();
          return total + (credit.montant_mensualite * moisRestants);
        }
        
        return total;
      }, 0);
    }
  }, [totalMensualites, credits, currentView]);
  
  // Calculer le taux d'endettement en fonction de la vue (mensuel ou annuel)
  const tauxEndettement = useMemo(() => {
    if (currentView === "monthly") {
      return totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
    } else {
      // Pour la vue annuelle, calculer le taux sur la base du revenu annuel
      const revenuAnnuel = totalRevenue * 12;
      return revenuAnnuel > 0 ? (totalAmount / revenuAnnuel) * 100 : 0;
    }
  }, [totalAmount, totalRevenue, currentView]);
  
  const getBadgeVariant = (taux: number) => {
    if (taux < 30) return "default";
    if (taux < 40) return "secondary";
    return "destructive";
  };
  
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return {
    credits,
    totalAmount,
    tauxEndettement,
    badgeVariant: getBadgeVariant(tauxEndettement),
    currentMonthName,
    currentYear
  };
};
