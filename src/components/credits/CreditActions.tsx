
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

export const CreditActions = memo(
  ({ credit, onCreditDeleted }: CreditActionsProps) => {
    // Réduire les logs pour éviter les opérations coûteuses
    // console.log("Rendering CreditActions for", credit.nom_credit);
    
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Stabiliser les références des fonctions avec useCallback
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

    const handleEditClick = useCallback(() => {
      setShowEditDialog(true);
      setDropdownOpen(false);
    }, []);

    const handleDeleteClick = useCallback(() => {
      setShowDeleteDialog(true);
      setDropdownOpen(false);
    }, []);

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
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">
              <SquarePen className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
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
  // Fonction d'égalité optimisée et simplifiée
  (prevProps, nextProps) => {
    // Les fonctions de rappel sont comparées par référence,
    // mais nous sommes plus intéressés par les changements dans credit
    if (prevProps.credit.id !== nextProps.credit.id) {
      return false;
    }
    
    // Vérifier uniquement les champs critiques qui affectent le rendu
    return prevProps.credit.nom_credit === nextProps.credit.nom_credit &&
           prevProps.credit.statut === nextProps.credit.statut;
  }
);

// Nom explicite pour le débogage
CreditActions.displayName = "CreditActions";
