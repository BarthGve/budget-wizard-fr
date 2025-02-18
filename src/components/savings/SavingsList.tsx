import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface SavingsListProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }>;
  onSavingDeleted: () => void;
}
export const SavingsList = ({
  monthlySavings,
  onSavingDeleted
}: SavingsListProps) => {
  const handleDelete = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from("monthly_savings").delete().eq("id", id);
      if (error) throw error;
      toast.success("Épargne supprimée avec succès");
      onSavingDeleted();
    } catch (error) {
      console.error("Error deleting saving:", error);
      toast.error("Erreur lors de la suppression de l'épargne");
    }
  };
  return <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Versements mensuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {monthlySavings.map(saving => <div key={saving.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-4">
                  <img src={saving.logo_url || "/placeholder.svg"} alt={saving.name} className="w-10 h-10 rounded-full object-contain" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }} />
                  <div>
                    <h4 className="font-medium">{saving.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(saving.amount)} / mois
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem>
                        Modifier
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer l'épargne</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette épargne ? Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(saving.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>)}
            {monthlySavings.length === 0 && <p className="text-center text-muted-foreground">
                Aucune épargne enregistrée
              </p>}
          </div>
        </CardContent>
      </Card>
    </div>;
};