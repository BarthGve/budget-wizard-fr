
import { Credit } from "../types";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditCardDetailsProps {
  credit: Credit;
  index: number;
  isArchived?: boolean;
}

export const CreditCardDetails = ({ credit, index, isArchived = false }: CreditCardDetailsProps) => {
  const calculateProgress = () => {
    // Pour les crédits remboursés, le progrès est de 100%
    if (credit.statut === "remboursé" || isArchived) {
      return 100;
    }

    const startDate = new Date(credit.date_premiere_mensualite);
    const endDate = new Date(credit.date_derniere_mensualite);
    const today = new Date();

    // Si le crédit n'a pas encore commencé
    if (today < startDate) {
      return 0;
    }

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();

    return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
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

  // Formater la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM yyyy", { locale: fr });
  };

  const totalAmount = calculateTotalAmount();
  const progress = calculateProgress();
  const progressText = isArchived ? "100%" : `${Math.round(progress)}%`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.08 + 0.2, duration: 0.3 }}
      className="flex flex-col p-4 flex-1"
    >
      <div className="grid grid-cols-3 gap-4 items-center">
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
            {credit.montant_mensualite.toLocaleString("fr-FR")} €
          </p>
        </div>
        
        <div>
          <span className={cn(
            "text-sm font-medium",
            isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
          )}>
            Total ({formatDate(credit.date_derniere_mensualite)})
          </span>
          <p className={cn(
            "font-semibold",
            isArchived ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
          )}>
            {totalAmount.toLocaleString("fr-FR")} €
          </p>
        </div>

          <div>
          <span className={cn(
            "text-sm font-medium",
            isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
          )}>
            Total ({formatDate(credit.date_derniere_mensualite)})
          </span>
          <p className={cn(
            "font-semibold",
            isArchived ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
          )}>
            {totalAmount.toLocaleString("fr-FR")} €
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <span className={cn(
              "text-xs",
              isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
            )}>
              {progressText}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Progress 
                  value={progress} 
                  className={cn(
                    "h-2 mt-1",
                    isArchived 
                      ? "bg-gray-200 dark:bg-gray-700" 
                      : "bg-purple-100 dark:bg-purple-900/30"
                  )}
                  indicatorClassName={cn(
                    isArchived
                      ? "bg-green-500 dark:bg-green-600"
                      : "bg-purple-600 dark:bg-purple-500"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent className="space-y-2">
                <p>Progression : {Math.round(progress)}%</p>
                <p>Montant remboursé : {Math.round(totalAmount * progress / 100).toLocaleString("fr-FR")} €</p>
                <p>Montant restant : {Math.round(totalAmount * (1 - progress / 100)).toLocaleString("fr-FR")} €</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
};
