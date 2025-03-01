
import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "./types";
import { CreditDialog } from "./CreditDialog";

interface CreditActionsProps {
  credit: Credit;
  onCreditDeleted: () => void;
}

// Optimisation avec memo et une fonction d'égalité personnalisée
export const CreditActions = memo(
  ({ credit, onCreditDeleted }: CreditActionsProps) => {
    console.log("Rendering CreditActions for", credit.nom_credit);
    
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Utilisation de useCallback pour éviter de recréer la fonction à chaque render
    const handleDelete = useCallback(async () => {
      try {
        const { error } = await supabase
          .from("credits")
          .delete()
          .eq("id", credit.id);

        if (error) throw error;

        toast.success("Crédit supprimé avec succès");
        onCreditDeleted();
      } catch (error) {
        console.error("Error deleting credit:", error);
        toast.error("Erreur lors de la suppression du crédit");
      }
      setShowDeleteDialog(false);
      setDropdownOpen(false);
    }, [credit.id, onCreditDeleted]);

    // Optimisation des callbacks pour les contrôles d'interface utilisateur
    const handleEditClick = useCallback(() => {
      setShowEditDialog(true);
      setDropdownOpen(false);
    }, []);

    const handleDeleteClick = useCallback(() => {
      setShowDeleteDialog(true);
      setDropdownOpen(false);
    }, []);

    // Optimisation pour éviter les fermetures/ouvertures inutiles
    const handleOpenChange = useCallback((open: boolean) => {
      setDropdownOpen(open);
    }, []);

    const handleDeleteDialogChange = useCallback((open: boolean) => {
      setShowDeleteDialog(open);
    }, []);

    const handleEditDialogChange = useCallback((open: boolean) => {
      setShowEditDialog(open);
    }, []);

    return (
      <>
        <DropdownMenu open={dropdownOpen} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={handleEditClick}>
              <SquarePen className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={handleDeleteClick}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreditDialog 
          credit={credit}
          open={showEditDialog}
          onOpenChange={handleEditDialogChange}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={handleDeleteDialogChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le crédit</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce crédit ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
  // Fonction d'égalité personnalisée pour optimiser les rendus
  (prevProps, nextProps) => {
    // Comparer uniquement les propriétés pertinentes du crédit
    return (
      prevProps.credit.id === nextProps.credit.id &&
      prevProps.credit.statut === nextProps.credit.statut &&
      prevProps.onCreditDeleted === nextProps.onCreditDeleted
    );
  }
);

// Ajouter un displayName pour faciliter le débogage
CreditActions.displayName = "CreditActions";
