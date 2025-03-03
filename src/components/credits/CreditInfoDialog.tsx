
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Credit } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditProgressBar } from "./CreditProgressBar";

interface CreditInfoDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditInfoDialog = ({ credit, open, onOpenChange }: CreditInfoDialogProps) => {
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

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Progression du remboursement</p>
            <CreditProgressBar
              dateDebut={credit.date_premiere_mensualite}
              dateFin={credit.date_derniere_mensualite}
              montantMensuel={credit.montant_mensualite}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
