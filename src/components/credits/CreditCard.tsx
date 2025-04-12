
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreditCardInfo } from "./card-components/CreditCardInfo";
import { CreditCardDetails } from "./card-components/CreditCardDetails";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface CreditCardProps {
  credit: Credit;
  index: number;
  onCreditDeleted: () => void;
  isArchived?: boolean;
}

export const CreditCard = ({ credit, index, onCreditDeleted, isArchived = false }: CreditCardProps) => {
  // Utilisation du hook pour détecter si l'écran est petit (mobile)
  const isMobile = useMediaQuery("(max-width: 639px)");
  
  return (
    <motion.div
      key={credit.id}
      initial={{ 
        opacity: 0,
        y: 20,
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      }}
   
      className="transform-gpu"
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          // Light mode - style différent pour les crédits archivés
          isArchived 
            ? "bg-gray-50 border border-gray-200 shadow-sm "
            : "bg-white border border-primary-100 shadow-sm ",
          // Dark mode - alignées avec les cards de graphiques
          isArchived
            ? "dark:bg-gray-800/70 dark:border-gray-700/40 dark:hover:border-gray-700/60"
            : "dark:bg-gray-800/90 dark:border-primary-800/40  dark:shadow-primary-800/30 "
        )}
      >
        {isMobile ? (
          // Version mobile compacte
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center flex-1">
              <CreditCardInfo credit={credit} index={index} isMobile={true} isArchived={isArchived} />
              <div className="ml-2">
                <span className={cn(
                  "text-sm font-medium",
                  isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
                )}>
                  Mensualité
                </span>
                <p className={cn(
                  "font-semibold",
                  isArchived ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
                )}>
                  {credit.montant_mensualite
                    ? credit.montant_mensualite.toLocaleString("fr-FR") + " €"
                    : "N/A"}
                </p>
              </div>
            </div>
            <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} isArchived={isArchived} />
          </div>
        ) : (
          // Version desktop originale
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CreditCardInfo credit={credit} index={index} isArchived={isArchived} />
            <CreditCardDetails credit={credit} index={index} isArchived={isArchived} />
            <motion.div 
              className="px-4 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.3, duration: 0.3 }}
            >
              <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} isArchived={isArchived} />
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
