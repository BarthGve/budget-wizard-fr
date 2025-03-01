
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFirstVisit } from "@/hooks/useFirstVisit";

interface CreditCardProps {
  credit: Credit;
  index: number;
  onCreditDeleted: () => void;
}

export const CreditCard = ({ credit, index, onCreditDeleted }: CreditCardProps) => {
  // Vérifier si c'est la première visite de la page Credits
  const isFirstVisit = useFirstVisit('credits-page');
  
  return (
    <motion.div
      key={credit.id}
      initial={isFirstVisit ? { 
        opacity: 0,
        y: 50,
        rotateX: 45,
        scale: 0.9,
        z: -100
      } : { opacity: 1 }}
      animate={isFirstVisit ? { 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        scale: 1,
        z: 0
      } : { opacity: 1 }}
      transition={isFirstVisit ? {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
        duration: 0.5
      } : undefined}
      whileHover={isFirstVisit ? {
        scale: 1.02,
        z: 20,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      } : undefined}
      style={isFirstVisit ? {
        transformStyle: "preserve-3d",
        perspective: "1000px"
      } : undefined}
      className="transform-gpu"
    >
      <Card
        className={cn(
          "overflow-hidden border bg-card dark:bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-1">
          <CreditCardInfo credit={credit} index={index} isFirstVisit={isFirstVisit} />
          <CreditCardDetails credit={credit} index={index} isFirstVisit={isFirstVisit} />
          <motion.div 
            className="px-4 py-2"
            initial={isFirstVisit ? { opacity: 0, scale: 0.5 } : false}
            animate={isFirstVisit ? { opacity: 1, scale: 1 } : false}
            transition={isFirstVisit ? { delay: index * 0.1 + 0.5, duration: 0.3 } : undefined}
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
  isFirstVisit?: boolean;
}

export const CreditCardInfo = ({ credit, index, isFirstVisit = true }: CreditCardInfoProps) => {
  return (
    <div className="flex items-center px-4 gap-4 md:w-1/3">
      <motion.div
        initial={isFirstVisit ? { rotate: -30, scale: 0.8 } : false}
        animate={isFirstVisit ? { rotate: 0, scale: 1 } : false}
        transition={isFirstVisit ? { delay: index * 0.1 + 0.2, duration: 0.5 } : undefined}
      >
        {credit.logo_url ? (
          <img
            src={credit.logo_url}
            alt={credit.nom_credit}
            className="w-8 h-8 rounded-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-8 h-8 bg-violet-100 rounded-full" />
        )}
      </motion.div>
      <h4 className="font-medium">{credit.nom_credit}</h4>
    </div>
  );
};

interface CreditCardDetailsProps {
  credit: Credit;
  index: number;
  isFirstVisit?: boolean;
}

export const CreditCardDetails = ({ credit, index, isFirstVisit = true }: CreditCardDetailsProps) => {
  return (
    <motion.div 
      className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-card dark:bg-card"
      initial={isFirstVisit ? { opacity: 0, x: 20 } : false}
      animate={isFirstVisit ? { opacity: 1, x: 0 } : false}
      transition={isFirstVisit ? { delay: index * 0.1 + 0.3, duration: 0.4 } : undefined}
    >
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Mensualité</span>
        <h4 className="font-medium">
          {credit.montant_mensualite
            ? credit.montant_mensualite.toLocaleString("fr-FR") + " €"
            : "N/A"}
        </h4>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Dernière échéance</span>
        <span className="font-medium">
          {credit.date_derniere_mensualite
            ? new Date(credit.date_derniere_mensualite).toLocaleDateString("fr-FR")
            : "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Statut</span>
        <motion.span
          initial={isFirstVisit ? { scale: 0, opacity: 0 } : false}
          animate={isFirstVisit ? { scale: 1, opacity: 1 } : false}
          transition={isFirstVisit ? { delay: index * 0.1 + 0.4, duration: 0.3 } : undefined}
          className={`inline-flex items-center ${
            credit.statut.toLowerCase() === "actif"
              ? "text-green-600"
              : credit.statut.toLowerCase() === "remboursé"
              ? "text-gray-600"
              : ""
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              credit.statut.toLowerCase() === "actif"
                ? "bg-green-600"
                : credit.statut.toLowerCase() === "remboursé"
                ? "bg-gray-600"
                : ""
            }`}
          />
          {credit.statut}
        </motion.span>
      </div>
    </motion.div>
  );
};
