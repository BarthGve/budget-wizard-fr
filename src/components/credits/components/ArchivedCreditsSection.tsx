
import { motion } from "framer-motion";
import { Credit } from "../types";
import { CreditsList } from "../CreditsList";
import { cn } from "@/lib/utils";
import { NoArchivedCredits } from "./NoArchivedCredits";
import { useState } from "react";
import { ChevronDown, ChevronUp, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArchivedCreditsSectionProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const ArchivedCreditsSection = ({ 
  credits, 
  onCreditDeleted 
}: ArchivedCreditsSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const archivedCredits = credits.filter(credit => credit.statut === 'remboursé');

  if (archivedCredits.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de crédits archivés
  }

  // Calculer le montant total remboursé
  const totalAmountRepaid = archivedCredits.reduce((total, credit) => {
    // Nombre total de mensualités
    const firstPaymentDate = new Date(credit.date_premiere_mensualite);
    const lastPaymentDate = new Date(credit.date_derniere_mensualite);
    const totalMonths = 
      (lastPaymentDate.getFullYear() - firstPaymentDate.getFullYear()) * 12 + 
      (lastPaymentDate.getMonth() - firstPaymentDate.getMonth()) + 1;
      
    return total + (credit.montant_mensualite * totalMonths);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn(
          "font-bold tracking-tight text-xl flex items-center gap-2",
          // Même dégradé que le titre principal pour la cohérence
          "bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500 bg-clip-text text-transparent",
          "dark:from-purple-400 dark:via-purple-400 dark:to-violet-400"
        )}>
          <div className={cn(
            "p-1 rounded",
            "bg-purple-100 dark:bg-purple-800/40"
          )}>
            <Archive className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Archives
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            "text-gray-500 hover:text-purple-600",
            "dark:text-gray-400 dark:hover:text-purple-400"
          )}
        >
          {expanded ? (
            <>
              Masquer
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Afficher ({archivedCredits.length})
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn(
            "p-3 mb-3 rounded-md",
            "bg-purple-50/80 border border-purple-100",
            "dark:bg-purple-900/10 dark:border-purple-800/30"
          )}>
            <span className="text-sm text-purple-700 dark:text-purple-400">
              Montant total remboursé : <strong>{totalAmountRepaid.toLocaleString('fr-FR')} €</strong>
            </span>
          </div>
          
          <CreditsList 
            credits={archivedCredits}
            onCreditDeleted={onCreditDeleted}
            isArchived={true}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
