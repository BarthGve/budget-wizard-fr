
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CreditDetailsProps {
  credit: {
    nom_credit: string;
    nom_domaine: string;
    logo_url: string;
    montant_mensualite: number;
    date_derniere_mensualite: string;
    statut: 'actif' | 'remboursé';
    created_at: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditDetails({ credit, open, onOpenChange }: CreditDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du crédit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={credit.logo_url}
              alt={credit.nom_credit}
              className="w-12 h-12 rounded-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <div>
              <h3 className="font-semibold">{credit.nom_credit}</h3>
              <p className="text-sm text-muted-foreground">{credit.nom_domaine}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Mensualité</span>
              <span className="font-medium">{credit.montant_mensualite.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Dernière échéance</span>
              <span className="font-medium">
                {new Date(credit.date_derniere_mensualite).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Statut</span>
              <span className={`font-medium ${credit.statut === 'actif' ? 'text-green-600' : 'text-gray-600'}`}>
                {credit.statut === 'actif' ? 'En cours' : 'Remboursé'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Date de création</span>
              <span className="font-medium">
                {new Date(credit.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
