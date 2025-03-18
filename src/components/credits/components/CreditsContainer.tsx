
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
  
  // Calcul du montant total emprunté (la somme totale des crédits)
  // Pour chaque crédit actif, nous calculons le montant total emprunté en multipliant 
  // la mensualité par le nombre total de mensualités
  const calculateTotalDebt = () => {
    return activeCredits.reduce((total, credit) => {
      // Calcul du nombre total de mensualités pour ce crédit
      const firstPaymentDate = new Date(credit.date_premiere_mensualite);
      const lastPaymentDate = new Date(credit.date_derniere_mensualite);
      
      // Calcul du nombre total de mois entre la première et la dernière mensualité
      const totalMonths = 
        (lastPaymentDate.getFullYear() - firstPaymentDate.getFullYear()) * 12 + 
        (lastPaymentDate.getMonth() - firstPaymentDate.getMonth()) + 1; // +1 pour inclure le mois de début
      
      // Calculer le montant total emprunté pour ce crédit
      const totalLoanAmount = credit.montant_mensualite * totalMonths;
      
      // Ajouter au total global
      return total + totalLoanAmount;
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
