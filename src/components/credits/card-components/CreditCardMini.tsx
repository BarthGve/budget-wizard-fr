
import { Credit } from "../types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CreditActions } from "../CreditActions";

interface CreditCardMiniProps {
  credit: Credit;
  index: number;
  onCreditDeleted: () => void;
}

export const CreditCardMini = ({ credit, index, onCreditDeleted }: CreditCardMiniProps) => {
  return (
    <div className="p-3 flex items-center justify-between">
      {/* Partie gauche - Logo et nom */}
      <div className="flex items-center gap-3">
        {credit.logo_url ? (
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden",
            // Light mode
            "bg-white border border-purple-100 shadow-sm",
            // Dark mode
            "dark:bg-gray-800 dark:border-purple-800/40"
          )}>
            <img
              src={credit.logo_url}
              alt={credit.nom_credit}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        ) : (
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            // Light mode
            "bg-purple-100 text-purple-600",
            // Dark mode
            "dark:bg-purple-900/30 dark:text-purple-400"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        )}
        
        <div className="flex flex-col">
          <h4 className={cn(
            "font-medium text-sm",
            // Light mode
            "text-gray-800",
            // Dark mode
            "dark:text-gray-200"
          )}>
            {credit.nom_credit}
          </h4>
          <p className={cn(
            "text-xs",
            // Light mode
            "text-gray-500",
            // Dark mode
            "dark:text-gray-400"
          )}>
            {credit.montant_mensualite
              ? credit.montant_mensualite.toLocaleString("fr-FR") + " €"
              : "N/A"}
          </p>
        </div>
      </div>
      
      {/* Menu d'actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.2, duration: 0.3 }}
      >
        <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
      </motion.div>
    </div>
  );
};
