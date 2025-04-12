
import { Credit } from "../types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditProgressBar } from "@/components/credits/CreditProgressBar";
import { formatCurrency } from "@/utils/format";

interface CreditCardDetailsProps {
  credit: Credit;
  index: number;
  isArchived?: boolean;
}

export const CreditCardDetails = ({ credit, index, isArchived = false }: CreditCardDetailsProps) => {
  // Formater la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM yyyy", { locale: fr });
  };

  // Calculer le montant total du crédit
  const calculateTotalAmount = () => {
    const startDate = new Date(credit.date_premiere_mensualite);
    const endDate = new Date(credit.date_derniere_mensualite);
    
    // Calculer le nombre de mois entre les deux dates
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
      (endDate.getMonth() - startDate.getMonth()) + 1;
    
    return months * credit.montant_mensualite;
  };

  const totalAmount = calculateTotalAmount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.08 + 0.2, duration: 0.3 }}
      className="flex flex-col p-4 flex-1"
    >
      <div className="grid grid-cols-4 gap-2 items-center">
        <div>
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
            {formatCurrency(credit.montant_mensualite, 0)}
          </p>
        </div>
        
        <div>
          <span className={cn(
            "text-sm font-medium",
            isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
          )}>
            Total
          </span>
          <p className={cn(
            "font-semibold",
            isArchived ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
          )}>
            {formatCurrency(totalAmount, 0)}
          </p>
        </div>

        <div>
          <span className={cn(
            "text-sm font-medium",
            isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
          )}>
            Dernière échéance 
          </span>
          <p className={cn(
            "font-semibold",
            isArchived ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
          )}>
           {formatDate(credit.date_derniere_mensualite)}
          </p>
        </div>
        
        <div>
          <div className="w-full">
            {/* Utilisation du composant CreditProgressBar avec tous les détails nécessaires */}
            <CreditProgressBar 
              dateDebut={credit.date_premiere_mensualite}
              dateFin={credit.date_derniere_mensualite}
              montantMensuel={credit.montant_mensualite}
              withTooltip={true}
              colorScheme={isArchived ? "quaternary" : "primary"}
              // Si le crédit est archivé, on force la progression à 100%
              value={isArchived || credit.statut === "remboursé" ? 100 : undefined}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
