
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";

interface CreditsListProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

// Optimizing with explicit equality check
export const CreditsList = memo(
  ({ credits, onCreditDeleted }: CreditsListProps) => {
    console.log("Rendering CreditsList", credits.length);

    if (!credits || credits.length === 0) {
      return (
        <Card className="p-4">
          <div className="text-center text-muted-foreground">
            Aucun crédit trouvé
          </div>
        </Card>
      );
    }

    // Create a new array to avoid modifying the original
    const sortedCredits = [...credits].sort((a, b) => {
      return (
        new Date(a.date_derniere_mensualite).getTime() -
        new Date(b.date_derniere_mensualite).getTime()
      );
    });

    return (
      <div className="grid gap-2">
        {sortedCredits.map((credit) => (
          <Card
            key={credit.id}
            className={`overflow-hidden border bg-card dark:bg-card ${
              credit.statut.toLowerCase() === "remboursé"
                ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20"
                : ""
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Infos principales */}
              <div className="flex items-center px-4 gap-4 md:w-1/3">
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
                <h4 className="font-medium">{credit.nom_credit}</h4>
              </div>

              {/* Détails du crédit */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-card dark:bg-card">
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
                  <span
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
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-2">
                <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  },
  // Optimisé: Fonction d'égalité améliorée pour mieux détecter les changements
  (prevProps, nextProps) => {
    // Si la longueur est différente, les tableaux sont différents
    if (prevProps.credits.length !== nextProps.credits.length) {
      return false;
    }
    
    // Vérifier si onCreditDeleted a changé
    if (prevProps.onCreditDeleted !== nextProps.onCreditDeleted) {
      return false;
    }
    
    // Vérifier si les IDs et les contenus des crédits ont changé
    const prevIds = new Set(prevProps.credits.map(c => c.id));
    const nextIds = new Set(nextProps.credits.map(c => c.id));
    
    // Si les ensembles d'IDs diffèrent en taille, il y a eu un changement
    if (prevIds.size !== nextIds.size) {
      return false;
    }
    
    // Vérifier si tous les IDs de prevProps sont dans nextProps
    for (const id of prevIds) {
      if (!nextIds.has(id)) {
        return false;
      }
    }
    
    // Vérification profonde des propriétés importantes pour chaque crédit
    for (let i = 0; i < prevProps.credits.length; i++) {
      const prevCredit = prevProps.credits[i];
      const nextCredit = nextProps.credits.find(c => c.id === prevCredit.id);
      
      if (!nextCredit || 
          prevCredit.statut !== nextCredit.statut ||
          prevCredit.montant_mensualite !== nextCredit.montant_mensualite ||
          prevCredit.date_derniere_mensualite !== nextCredit.date_derniere_mensualite) {
        return false;
      }
    }
    
    // Pas de changement détecté
    return true;
  }
);

CreditsList.displayName = "CreditsList";
