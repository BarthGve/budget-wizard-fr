
import { Credit } from "../types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check } from "lucide-react";
import { statusLabels } from "../types";

interface CreditCardInfoProps {
  credit: Credit;
  index: number;
  isMobile?: boolean;
  isArchived?: boolean;
}

export const CreditCardInfo = ({ credit, index, isMobile = false, isArchived = false }: CreditCardInfoProps) => {
  // Fonction pour formater la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM yyyy", { locale: fr });
  };

  return (
    <div className="flex items-center p-4 md:w-64">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.08 + 0.1, duration: 0.2 }}
        className="mr-4 flex-shrink-0"
      >
        {credit.logo_url ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm">
            <img
              src={credit.logo_url}
              alt={credit.nom_domaine}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            // Couleur différente pour les crédits archivés
            isArchived 
              ? "bg-gray-200 dark:bg-gray-700" 
              : "bg-purple-100 dark:bg-purple-900/40",
            // Texte
            isArchived 
              ? "text-gray-500 dark:text-gray-400" 
              : "text-purple-700 dark:text-purple-300"
          )}>
            <span className="text-lg font-semibold">
              {credit.nom_credit.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <h4 className={cn(
            "font-semibold",
            // Couleur différente pour les crédits archivés
            isArchived 
              ? "text-gray-600 dark:text-gray-400" 
              : "text-gray-800 dark:text-gray-200"
          )}>
            {credit.nom_credit}
          </h4>

          {!isMobile && (
            <Badge
              variant="outline"
              className={cn(
                "ml-2 text-xs capitalize",
                isArchived 
                  ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/40" 
                  : "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700/40"
              )}
            >
              {isArchived && <Check className="w-3 h-3 mr-1" />}
              {statusLabels[credit.statut]}
            </Badge>
          )}
        </div>

        <div className={cn(
          "text-sm mt-0.5",
          isArchived 
            ? "text-gray-400 dark:text-gray-500" 
            : "text-gray-500 dark:text-gray-400"
        )}>
          {credit.nom_domaine}
          {!isMobile && (
            <>
              <span className="mx-1">•</span>
              <span>
                {isArchived 
                  ? `Remboursé en ${formatDate(credit.date_derniere_mensualite)}` 
                  : `Jusqu'au ${formatDate(credit.date_derniere_mensualite)}`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
