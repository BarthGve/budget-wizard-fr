
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Credit } from "./types";
import { format, differenceInMonths, isAfter, isSameDay, addMonths, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { CreditProgressBar } from "./CreditProgressBar";

interface CreditInfoDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditInfoDialog = ({ credit, open, onOpenChange }: CreditInfoDialogProps) => {
  // Calcul de la progression
  const startDate = new Date(credit.date_premiere_mensualite);
  const endDate = new Date(credit.date_derniere_mensualite);
  const currentDate = new Date();
  
  // Calculer le nombre total de mois entre le début et la fin
  const totalMonths = differenceInMonths(endDate, startDate) + 1; // +1 car on compte la mensualité du jour de début
  
  // Calcul du nombre exact de mensualités payées
  let completedMonths = 0;
  
  // Vérifier si on est avant la première échéance
  if (isBefore(currentDate, startDate)) {
    completedMonths = 0;
  } else {
    // Compter chaque mensualité une par une
    let paymentDate = new Date(startDate);
    
    while (isBefore(paymentDate, currentDate) || isSameDay(paymentDate, currentDate)) {
      completedMonths++;
      
      // Si on atteint la date de fin, on s'arrête
      if (isSameDay(paymentDate, endDate)) {
        break;
      }
      
      // Passer à la prochaine mensualité
      paymentDate = addMonths(paymentDate, 1);
    }
  }
  
  // Limiter le nombre de mensualités au total des mensualités
  completedMonths = Math.min(completedMonths, totalMonths);
  
  // Calculer le pourcentage de progression basé sur les mensualités payées
  const progressPercentage = Math.min(100, Math.max(0, (completedMonths / totalMonths) * 100));

  // Calculer le montant total et le montant déjà remboursé
  const montantTotal = totalMonths * credit.montant_mensualite;
  const montantRembourse = completedMonths * credit.montant_mensualite;
  const montantRestant = montantTotal - montantRembourse;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {credit.nom_credit}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-4">
            {credit.logo_url && (
              <img
                src={credit.logo_url}
                alt={credit.nom_credit}
                className="w-12 h-12 rounded-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            )}
            <div>
              <h4 className="font-medium">{credit.nom_domaine}</h4>
              <p className="text-sm text-muted-foreground">
                Mensualité : {credit.montant_mensualite.toLocaleString('fr-FR')}€
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Première échéance</p>
                <p className="font-medium">
                  {format(new Date(credit.date_premiere_mensualite), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière échéance</p>
                <p className="font-medium">
                  {format(new Date(credit.date_derniere_mensualite), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Progression du remboursement</p>
            <CreditProgressBar 
              dateDebut={credit.date_premiere_mensualite} 
              dateFin={credit.date_derniere_mensualite} 
              montantMensuel={credit.montant_mensualite} 
            />
            
            <div className="bg-muted/20 p-3 rounded-md space-y-1">
              <p className="text-sm">Mensualités payées : {completedMonths} sur {totalMonths}</p>
              <p className="text-sm">Progression : {progressPercentage.toFixed(1)}%</p>
              <p className="text-sm">Montant remboursé : {formatCurrency(montantRembourse)}</p>
              <p className="text-sm">Montant restant : {formatCurrency(montantRestant)}</p>
              <p className="text-sm">Montant total : {formatCurrency(montantTotal)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
