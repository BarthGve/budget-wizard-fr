
import { Card } from "@/components/ui/card";
import { Credit } from "./types";
import { CreditActions } from "./CreditActions";

interface CreditsListProps {
  credits: Credit[];
  onCreditDeleted: () => void;
}

export const CreditsList = ({ credits, onCreditDeleted }: CreditsListProps) => {
  console.log("CreditsList received credits:", credits.map(c => ({id: c.id, status: c.statut})));
  
  return (
    <div className="grid gap-2">
      {credits.map((credit) => (
        <Card key={credit.id} className="overflow-hidden border bg-card dark:bg-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center px-4 gap-4 md:w-1/3">
              {credit.logo_url ? (
                <img
                  src={credit.logo_url}
                  alt={credit.nom_credit}
                  className="w-8 h-8 rounded-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-violet-100 rounded-full" />
              )}
              <div>
                <h4 className="font-medium">{credit.nom_credit}</h4>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-card dark:bg-card">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Mensualité</span>
                <h4 className="font-medium">
                  {credit.montant_mensualite.toLocaleString('fr-FR')} €
                </h4>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Dernière échéance</span>
                <span className="font-medium">
                  {new Date(credit.date_derniere_mensualite).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Statut</span>
                <span className={`inline-flex items-center ${
                  credit.statut === 'actif' 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    credit.statut === 'actif' 
                      ? 'bg-green-600' 
                      : 'bg-gray-600'
                  }`} />
                  {credit.statut === 'actif' ? 'Actif' : 'Remboursé'}
                </span>
              </div>
            </div>

            <div className="px-4 py-2">
              <CreditActions credit={credit} onCreditDeleted={onCreditDeleted} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
