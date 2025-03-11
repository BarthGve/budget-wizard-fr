
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreditProgressBar } from "./CreditProgressBar";

interface CreditCardProps {
  credit: Credit;
  index: number;
  onCreditDeleted: () => void;
}

export const CreditCard = ({ credit, index, onCreditDeleted }: CreditCardProps) => {
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
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="transform-gpu"
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          // Light mode
          "bg-white border border-purple-100 shadow-sm hover:shadow-md",
          // Dark mode
          "dark:bg-gray-800/90 dark:border-purple-800/40 dark:hover:border-purple-700/60"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
          <CreditCardInfo credit={credit} index={index} />
          <CreditCardDetails credit={credit} index={index} />
          <motion.div 
            className="px-4 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.3 }}
          >
            <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

interface CreditCardInfoProps {
  credit: Credit;
  index: number;
}

export const CreditCardInfo = ({ credit, index }: CreditCardInfoProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-4 md:w-1/3 cursor-pointer rounded-md p-2 transition-colors",
        // Light mode
        "hover:bg-purple-50/70",
        // Dark mode
        "dark:hover:bg-purple-900/20"
      )}
    >
      {credit.logo_url ? (
        <div className={cn(
          "w-10 h-10 rounded-lg p-1 flex items-center justify-center overflow-hidden",
          // Light mode
          "bg-white border border-purple-100 shadow-sm",
          // Dark mode
          "dark:bg-gray-800 dark:border-purple-800/40"
        )}>
          <img
            src={credit.logo_url}
            alt={credit.nom_credit}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      ) : (
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          // Light mode
          "bg-purple-100 text-purple-600",
          // Dark mode
          "dark:bg-purple-900/30 dark:text-purple-400"
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
      )}
  
      <h4 className={cn(
        "font-medium text-base",
        // Light mode
        "text-gray-800",
        // Dark mode
        "dark:text-gray-200"
      )}>
        {credit.nom_credit}
      </h4>
    </div>
  );
};

interface CreditCardDetailsProps {
  credit: Credit;
  index: number;
}

export const CreditCardDetails = ({ credit, index }: CreditCardDetailsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 flex-1 py-2 px-4">
      <div className="flex flex-col">
        <span className={cn(
          "text-sm",
          // Light mode
          "text-gray-500",
          // Dark mode
          "dark:text-gray-400"
        )}>
          Mensualité
        </span>
        <h4 className={cn(
          "font-medium",
          // Light mode
          "text-gray-800",
          // Dark mode
          "dark:text-gray-200"
        )}>
          {credit.montant_mensualite
            ? credit.montant_mensualite.toLocaleString("fr-FR") + " €"
            : "N/A"}
        </h4>
      </div>

      <div className="flex flex-col">
        <span className={cn(
          "text-sm",
          // Light mode
          "text-gray-500",
          // Dark mode
          "dark:text-gray-400"
        )}>
          Dernière échéance
        </span>
        <span className={cn(
          "font-medium",
          // Light mode
          "text-gray-800",
          // Dark mode
          "dark:text-gray-200"
        )}>
          {credit.date_derniere_mensualite
            ? new Date(credit.date_derniere_mensualite).toLocaleDateString("fr-FR")
            : "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className={cn(
          "text-sm",
          // Light mode
          "text-gray-500",
          // Dark mode
          "dark:text-gray-400"
        )}>
          Progression
        </span>
        <div className="w-full mt-1">
          <CreditProgressBar 
            dateDebut={credit.date_premiere_mensualite}
            dateFin={credit.date_derniere_mensualite}
            montantMensuel={credit.montant_mensualite}
          />
        </div>
      </div>
    </div>
  );
};
