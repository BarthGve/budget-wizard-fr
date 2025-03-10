
import { motion } from "framer-motion";
import { Credit } from "../types";
import { CreditsList } from "../CreditsList";
import { cn } from "@/lib/utils";
import { NoActiveCredits } from "./NoActiveCredits";

interface ActiveCreditsSectionProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const ActiveCreditsSection = ({ 
  credits, 
  onCreditDeleted 
}: ActiveCreditsSectionProps) => {
  const activeCredits = credits.filter(credit => credit.statut === 'actif');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className={cn(
        "font-bold tracking-tight text-2xl mb-4",
        // Même dégradé que le titre principal pour la cohérence
        "bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent",
        "dark:from-purple-400 dark:via-violet-400 dark:to-fuchsia-400"
      )}>
        Crédits en cours
      </h2>
      
      {activeCredits.length > 0 ? (
        <CreditsList 
          credits={activeCredits} 
          onCreditDeleted={onCreditDeleted} 
        />
      ) : (
        <NoActiveCredits />
      )}
    </motion.div>
  );
};
