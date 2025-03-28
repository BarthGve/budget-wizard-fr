
import { Separator } from "@/components/ui/separator";
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export interface StepFiveProps {
  data: Partial<SavingsProject>;
  mode: SavingsMode;
}

export const StepFive = ({ data, mode }: StepFiveProps) => {
  const formatCurrency = (value?: number) => {
    if (value === undefined) return "N/A";
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch (e) {
      return "Date invalide";
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card border rounded-lg">
      <h3 className="text-lg font-semibold text-center mb-4">Récapitulatif du projet</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Nom du projet</p>
          <p className="font-medium">{data.nom_projet || "Non défini"}</p>
        </div>
        
        {data.description && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{data.description}</p>
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Montant à atteindre</span>
          <span className="font-semibold">{formatCurrency(data.montant_total)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Mode de planification</span>
          <span className="font-semibold">
            {mode === "par_date" ? "Par date cible" : "Par mensualité fixe"}
          </span>
        </div>
        
        {mode === "par_date" ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date cible</span>
              <span className="font-semibold">{formatDate(data.date_estimee)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Montant mensuel estimé</span>
              <span className="font-semibold">{formatCurrency(data.montant_mensuel)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Montant mensuel</span>
              <span className="font-semibold">{formatCurrency(data.montant_mensuel)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date estimée</span>
              <span className="font-semibold">{formatDate(data.date_estimee)}</span>
            </div>
          </>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="bg-accent p-4 rounded-lg">
        <p className="text-sm text-center">
          En créant ce projet, vous pourrez suivre votre progression et visualiser le chemin vers votre objectif d'épargne.
        </p>
      </div>
    </div>
  );
};
