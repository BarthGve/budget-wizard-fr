
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Credit } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface CreditInfoDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditInfoDialog = ({ credit, open, onOpenChange }: CreditInfoDialogProps) => {
  // Calculer le montant total du crédit
  const calculateTotalAmount = () => {
    if (!credit.date_premiere_mensualite) return credit.montant_mensualite;
    
    const firstDate = new Date(credit.date_premiere_mensualite);
    const lastDate = new Date(credit.date_derniere_mensualite);
    
    // Calculer le nombre de mois entre les dates
    const months = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                  (lastDate.getMonth() - firstDate.getMonth()) + 1;
    
    return months * credit.montant_mensualite;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Détails du crédit</span>
            {credit.statut === "remboursé" && credit.is_early_settlement && (
              <Badge 
                variant="outline" 
                className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
              >
                <Zap className="h-3 w-3 mr-1" /> Soldé par anticipation
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Nom</h3>
              <p className="text-base">{credit.nom_credit}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Domaine</h3>
              <p className="text-base">{credit.nom_domaine}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Mensualité</h3>
              <p className="text-base">{credit.montant_mensualite.toLocaleString('fr-FR')} €</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Montant total</h3>
              <p className="text-base">{calculateTotalAmount().toLocaleString('fr-FR')} €</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Première mensualité</h3>
              <p className="text-base">
                {credit.date_premiere_mensualite 
                  ? format(new Date(credit.date_premiere_mensualite), 'dd MMMM yyyy', { locale: fr })
                  : "Non spécifiée"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">
                {credit.statut === "remboursé" && credit.is_early_settlement 
                  ? "Date de solde anticipé" 
                  : "Dernière mensualité"}
              </h3>
              <p className={cn(
                "text-base",
                credit.statut === "remboursé" && credit.is_early_settlement && "font-medium text-amber-600 dark:text-amber-400"
              )}>
                {format(new Date(credit.date_derniere_mensualite), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Statut</h3>
            <div className={cn(
              "inline-block px-2 py-1 rounded-full text-sm",
              credit.statut === "actif" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : credit.statut === "remboursé"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {credit.statut.charAt(0).toUpperCase() + credit.statut.slice(1)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
