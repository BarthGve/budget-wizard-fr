
import { memo } from "react";
import { motion } from "framer-motion";
import { Credit } from "../types";
import { CreditSummaryCards } from "../CreditSummaryCards";
import { CreditsHeader } from "./CreditsHeader";
import { ActiveCreditsSection } from "./ActiveCreditsSection";
import { ArchivedCreditsSection } from "./ArchivedCreditsSection";

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

  // Calculer le montant déjà remboursé pour tous les crédits actifs
  const calculateAmountPaid = () => {
    return activeCredits.reduce((total, credit) => {
      const firstPaymentDate = new Date(credit.date_premiere_mensualite);
      const today = new Date();
      
      // Si le crédit n'a pas encore commencé, rien n'a été remboursé
      if (firstPaymentDate > today) return total;
      
      // Calculer combien de mensualités ont été payées
      const monthsPaid = 
        (today.getFullYear() - firstPaymentDate.getFullYear()) * 12 + 
        (today.getMonth() - firstPaymentDate.getMonth()) + 
        (today.getDate() >= firstPaymentDate.getDate() ? 1 : 0); // Ajouter 1 si nous sommes à ou après le jour du mois de paiement
      
      // S'assurer que le nombre de mensualités payées ne dépasse pas le total
      const lastPaymentDate = new Date(credit.date_derniere_mensualite);
      const totalMonths = 
        (lastPaymentDate.getFullYear() - firstPaymentDate.getFullYear()) * 12 + 
        (lastPaymentDate.getMonth() - firstPaymentDate.getMonth()) + 1;
      
      const validMonthsPaid = Math.max(0, Math.min(monthsPaid, totalMonths));
      
      // Calculer le montant remboursé pour ce crédit
      const amountPaid = validMonthsPaid * credit.montant_mensualite;
      
      // Ajouter au total
      return total + amountPaid;
    }, 0);
  };

  const totalDebt = calculateTotalDebt();
  const amountPaid = calculateAmountPaid();

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
          amountPaid={amountPaid}
        />
      </motion.div>

      <div className="space-y-6">
        <ActiveCreditsSection 
          credits={credits}
          onCreditDeleted={onCreditDeleted}
        />
        
        <ArchivedCreditsSection 
          credits={credits} 
          onCreditDeleted={onCreditDeleted} 
        />
      </div>
    </motion.div>
  );
});

CreditsContainer.displayName = "CreditsContainer";
