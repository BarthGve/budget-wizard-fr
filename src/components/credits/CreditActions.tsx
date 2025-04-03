
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, SquarePen, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "./types";
import { CreditDialog } from "./CreditDialog";
import { CreditInfoDialog } from "./CreditInfoDialog";
import { useQueryClient } from "@tanstack/react-query";

interface CreditActionsProps {
  credit: Credit;
  onCreditDeleted: () => void;
  isArchived?: boolean;
}

export const CreditActions = ({ credit, onCreditDeleted, isArchived = false }: CreditActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("credits")
        .delete()
        .eq("id", credit.id);

      if (error) throw error;

      toast.success("Crédit supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["credits-monthly-stats"] });
      onCreditDeleted();
    } catch (error) {
      console.error("Error deleting credit:", error);
      toast.error("Erreur lors de la suppression du crédit");
    }
    setShowDeleteDialog(false);
    setDropdownOpen(false);
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
    setDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setDropdownOpen(false);
  };

  const handleInfoClick = () => {
    setShowInfoDialog(true);
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-8 w-8",
              isArchived 
                ? "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800" 
                : ""
            )}
            type="button"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handleInfoClick} className="cursor-pointer">
            <Info className="mr-2 h-4 w-4" />
            Détail
          </DropdownMenuItem>
          
          {!isArchived && (
            <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">
              <SquarePen className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="text-destructive cursor-pointer"
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!isArchived && (
        <CreditDialog 
          credit={credit}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      <CreditInfoDialog
        credit={credit}
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? "Supprimer ce crédit archivé" : "Supprimer le crédit"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {isArchived ? "ce crédit archivé" : "ce crédit"} ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              type="button"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Import nécessaire pour cn
import { cn } from "@/lib/utils";
