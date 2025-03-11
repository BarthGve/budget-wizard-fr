
import { Credit } from "../types";
import { cn } from "@/lib/utils";
import { CreditProgressBar } from "../CreditProgressBar";

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
