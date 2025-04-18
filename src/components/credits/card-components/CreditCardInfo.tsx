
import { motion } from "framer-motion";
import { Credit } from "../types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface CreditCardInfoProps {
  credit: Credit;
  index: number;
  isMobile?: boolean;
  isArchived?: boolean;
}

export const CreditCardInfo = ({ credit, index, isMobile = false, isArchived = false }: CreditCardInfoProps) => {
  // Déterminer les couleurs en fonction du statut (archivé ou non)
  const logoClass = cn(
    "rounded-md overflow-hidden flex items-center justify-center",
    isArchived 
      ? "bg-gray-200 dark:bg-gray-700" 
      : "bg-senary-100 dark:bg-senary-800/70",
    isMobile ? "h-10 w-10" : "h-16 w-16 md:h-12 md:w-12 lg:h-16 lg:w-16"
  );
  
  const titleClass = cn(
    "font-medium leading-none",
    isArchived ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white",
    isMobile ? "text-sm" : "text-base"
  );
  
  const domainClass = cn(
    "text-xs mt-1",
    isArchived ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
  );

  return (
    <motion.div 
      className={cn(
        "flex items-center p-4",
        isMobile ? "space-x-2" : "space-x-4"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <div className={logoClass}>
        {credit.logo_url ? (
          <img 
            src={credit.logo_url} 
            alt={credit.nom_credit} 
            className="object-cover w-5 h-5"
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center text-lg font-bold",
            isArchived 
              ? "text-gray-500 dark:text-gray-400" 
              : "text-senary-500 dark:text-senary-300"
          )}>
            {credit.nom_credit.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-center space-x-2">
          <h3 className={titleClass}>
            {credit.nom_credit}
          </h3>
          
          {/* Badge pour indiquer un solde anticipé */}
          {isArchived && credit.is_early_settlement && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium py-1",
                "bg-amber-50 text-amber-700 border-amber-200",
                "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
              )}
            >
              <Zap className="h-3 w-3 mr-1" /> Solde anticipé
            </Badge>
          )}
        </div>
     
      </div>
    </motion.div>
  );
};
