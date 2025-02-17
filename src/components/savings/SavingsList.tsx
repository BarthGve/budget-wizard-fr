
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SavingsListProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }>;
  onSavingDeleted: () => void;
}

export const SavingsList = ({ monthlySavings, onSavingDeleted }: SavingsListProps) => {
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("monthly_savings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Épargne supprimée avec succès");
      onSavingDeleted();
    } catch (error) {
      console.error("Error deleting saving:", error);
      toast.error("Erreur lors de la suppression de l'épargne");
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Mes versements mensuels d'épargne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlySavings.map((saving) => (
              <div
                key={saving.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={saving.logo_url || "/placeholder.svg"}
                    alt={saving.name}
                    className="w-14 h-14 rounded-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div>
                    <h4 className="font-medium">{saving.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(saving.amount)} / mois
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer l'épargne</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette épargne ? Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(saving.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
            {monthlySavings.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucune épargne enregistrée
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
