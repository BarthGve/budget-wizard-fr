
import { motion } from "framer-motion";
import { useState } from "react";
import { Credit } from "../types";
import { CreditsList } from "../CreditsList";
import { cn } from "@/lib/utils";
import { NoActiveCredits } from "./NoActiveCredits";
import { ChevronDown, ChevronUp, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveCreditsSectionProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const ActiveCreditsSection = ({ 
  credits, 
  onCreditDeleted 
}: ActiveCreditsSectionProps) => {
  const [expanded, setExpanded] = useState(true); // Par défaut, les crédits en cours sont affichés
  const activeCredits = credits.filter(credit => credit.statut === 'actif');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn(
          "font-bold tracking-tight text-xl flex items-center gap-2",
          // Même dégradé que le titre principal pour la cohérence
          "bg-gradient-to-r from-senary-600 to-senary-500  bg-clip-text text-transparent",
          "dark:from-senary-400 dark:to-violet-200"
        )}>
          <div className={cn(
            "p-1 rounded",
            "bg-senary-100 dark:bg-senary-800/40"
          )}>
            <WalletCards className="h-4 w-4 text-senary-600 dark:text-senary-400" />
          </div>
          Crédits en cours
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            "text-gray-500 hover:text-senary-600",
            "dark:text-gray-400 dark:hover:text-senary-400"
          )}
        >
          {expanded ? (
            <>
              Masquer
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Afficher ({activeCredits.length})
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
          {activeCredits.length > 0 ? (
            <CreditsList 
              credits={activeCredits} 
              onCreditDeleted={onCreditDeleted} 
            />
          ) : (
            <NoActiveCredits />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
