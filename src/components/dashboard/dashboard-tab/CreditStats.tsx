
import { useMemo } from "react";
import { Credit } from "@/components/credits/types";

interface CreditStatsProps {
  credits: Credit[];
  firstDayOfMonth: Date;
}

/**
 * Composant pour calculer les statistiques des crédits
 */
export const useCreditStats = ({ credits = [], firstDayOfMonth }: CreditStatsProps) => {
  // Memoize credit calculations to prevent recalculation on each render
  return useMemo(() => {
    const active = credits.filter(credit => credit.statut === 'actif') || [];
    const repaid = credits.filter(credit => {
      const repaymentDate = new Date(credit.date_derniere_mensualite);
      return credit.statut === 'remboursé' && repaymentDate >= firstDayOfMonth;
    }) || [];

    const activeMensualites = active.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
    const repaidThisMonthSum = repaid.reduce((sum, credit) => sum + credit.montant_mensualite, 0);

    return {
      activeCredits: active,
      repaidThisMonth: repaid, 
      totalMensualites: activeMensualites + repaidThisMonthSum
    };
  }, [credits, firstDayOfMonth]);
};
