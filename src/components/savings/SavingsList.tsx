
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { NewSavingDialog } from "./NewSavingDialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<{id: string} | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("monthly_savings").delete().eq("id", id);
      if (error) throw error;
      toast.success("Épargne supprimée avec succès");
      onSavingDeleted();
      setShowDeleteDialog(false);
      setDropdownOpen(false);
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
          {monthlySavings.map(saving => (
            <div key={saving.id} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={saving.logo_url || "/placeholder.svg"} 
                  alt={saving.name} 
                  className="w-10 h-10 rounded-full object-contain"
                  onError={e => {
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

              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <NewSavingDialog 
                    saving={saving}
                    trigger={
                      <DropdownMenuItem onClick={(e) => {
                        e.preventDefault();
                        setDropdownOpen(false);
                      }}>
                        Modifier
                      </DropdownMenuItem>
                    }
                    onSavingAdded={onSavingDeleted}
                  />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => {
                      setSelectedSaving(saving);
                      setShowDeleteDialog(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog open={showDeleteDialog && selectedSaving?.id === saving.id} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer l'épargne</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer cette épargne ? Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedSaving(null)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => selectedSaving && handleDelete(selectedSaving.id)}
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
  </div>;
};
