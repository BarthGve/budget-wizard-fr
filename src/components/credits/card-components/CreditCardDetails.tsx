
import { Credit } from "../types";
import { cn } from "@/lib/utils";
import { CreditProgressBar } from "../CreditProgressBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface CreditCardDetailsProps {
  credit: Credit;
  index: number;
}

export const CreditCardDetails = ({ credit, index }: CreditCardDetailsProps) => {
  // Utiliser le hook useMediaQuery pour détecter si nous sommes sur mobile
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className={cn(
      "flex-1 py-2 px-4",
      // Sur mobile, utiliser flex pour aligner les éléments sur une seule ligne
      isMobile ? "flex items-center justify-between" : "grid grid-cols-3 gap-6"
    )}>
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

      {/* Masquer la dernière échéance et la progression sur mobile */}
      {!isMobile && (
        <>
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
        </>
      )}
    </div>
  );
};
