
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";

interface CreditsListProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const CreditsList = memo(
  ({ credits, onCreditDeleted }: CreditsListProps) => {
    // Réduire les logs pour éviter les opérations coûteuses
    // console.log("Rendering CreditsList", credits.length);

    if (!credits || credits.length === 0) {
      return (
        <Card className="p-4">
          <div className="text-center text-muted-foreground">
            Aucun crédit trouvé
          </div>
        </Card>
      );
    }

    // Créer un nouveau tableau pour éviter de modifier l'original
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
            className="overflow-hidden border bg-card dark:bg-card"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-1">
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
  // Simplifier la fonction d'égalité pour plus d'efficacité
  (prevProps, nextProps) => {
    // Comparaison simple mais efficace des tableaux de crédits
    if (prevProps.credits.length !== nextProps.credits.length) {
      return false;
    }
    
    if (prevProps.onCreditDeleted !== nextProps.onCreditDeleted) {
      return false;
    }
    
    // Vérification rapide si tous les IDs sont identiques et dans le même ordre
    for (let i = 0; i < prevProps.credits.length; i++) {
      if (prevProps.credits[i].id !== nextProps.credits[i].id ||
          prevProps.credits[i].statut !== nextProps.credits[i].statut ||
          prevProps.credits[i].montant_mensualite !== nextProps.credits[i].montant_mensualite ||
          prevProps.credits[i].date_derniere_mensualite !== nextProps.credits[i].date_derniere_mensualite) {
        return false;
      }
    }
    
    return true;
  }
);

CreditsList.displayName = "CreditsList";
