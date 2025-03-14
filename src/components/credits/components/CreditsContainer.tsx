
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
