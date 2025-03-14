
import { memo } from "react";
import { motion } from "framer-motion";
import { ActiveCreditsCard } from "./cards/ActiveCreditsCard";
import { MonthlyRepaymentsCard } from "./cards/MonthlyRepaymentsCard";

interface CreditSummaryCardsProps {
  activeCredits: any[];
  repaidThisMonth: number;
  totalActiveMensualites: number;
  totalRepaidMensualitesThisMonth: number;
}

export const CreditSummaryCards = memo(({
  activeCredits,
  repaidThisMonth,
  totalActiveMensualites,
  totalRepaidMensualitesThisMonth
}: CreditSummaryCardsProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2 mb-6"
      >
        <ActiveCreditsCard 
          activeCredits={activeCredits}
          totalActiveMensualites={totalActiveMensualites}
        />

        <MonthlyRepaymentsCard 
          repaidThisMonth={repaidThisMonth}
          totalRepaidMensualitesThisMonth={totalRepaidMensualitesThisMonth}
        />
      </motion.div>
    </>
  );
});

CreditSummaryCards.displayName = "CreditSummaryCards";
