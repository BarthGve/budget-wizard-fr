
import { memo } from "react";
import { motion } from "framer-motion";
import { Credit } from "../types";
import { CreditSummaryCards } from "../CreditSummaryCards";
import { CreditsHeader } from "./CreditsHeader";
import { ActiveCreditsSection } from "./ActiveCreditsSection";

interface CreditsContainerProps {
  credits: Credit[];
  monthlyStats: {
    credits_rembourses_count: number;
    total_mensualites_remboursees: number;
  };
  onCreditDeleted: () => void;
}

export const CreditsContainer = memo(({ 
  credits, 
  monthlyStats,
  onCreditDeleted 
}: CreditsContainerProps) => {
  // Calculer les valeurs dérivées de manière optimisée
  const activeCredits = credits?.filter(credit => credit.statut === 'actif') || [];
  const totalActiveMensualites = activeCredits.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
  
  // Calcul du montant total de la dette (estimation basée sur les mensualités)
  // Pour chaque crédit actif, nous estimons le montant restant à payer en multipliant 
  // la mensualité par le nombre de mois restants jusqu'à la date de dernière mensualité
  const calculateTotalDebt = () => {
    return activeCredits.reduce((total, credit) => {
      const lastPaymentDate = new Date(credit.date_derniere_mensualite);
      const today = new Date();
      
      // Calcul du nombre de mois restants
      const monthsRemaining = 
        (lastPaymentDate.getFullYear() - today.getFullYear()) * 12 + 
        (lastPaymentDate.getMonth() - today.getMonth());
      
      // Ne compter que les mois futurs (positifs)
      const remainingPayments = Math.max(0, monthsRemaining);
      
      // Ajouter au total
      return total + (credit.montant_mensualite * remainingPayments);
    }, 0);
  };

  const totalDebt = calculateTotalDebt();

  return (
    <motion.div 
      className="space-y-6 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CreditsHeader />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <CreditSummaryCards 
          activeCredits={activeCredits} 
          repaidThisMonth={monthlyStats.credits_rembourses_count} 
          totalActiveMensualites={totalActiveMensualites} 
          totalRepaidMensualitesThisMonth={monthlyStats.total_mensualites_remboursees}
          totalDebt={totalDebt}
        />
      </motion.div>

      <div className="space-y-6">
        <ActiveCreditsSection 
          credits={credits}
          onCreditDeleted={onCreditDeleted}
        />
      </div>
    </motion.div>
  );
});

CreditsContainer.displayName = "CreditsContainer";
