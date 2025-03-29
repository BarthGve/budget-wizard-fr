
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface RetailerExpenseActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function RetailerExpenseActions({ onEdit, onDelete }: RetailerExpenseActionsProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  // Utilisons React.MouseEvent pour assurer la compatibilité avec React Router
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher le comportement par défaut
    e.stopPropagation();
    setIsAlertOpen(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete();
    setIsAlertOpen(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => {
          e.preventDefault(); // Empêcher le comportement par défaut
          e.stopPropagation();
          onEdit();
        }}
        aria-label="Modifier"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette dépense</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
