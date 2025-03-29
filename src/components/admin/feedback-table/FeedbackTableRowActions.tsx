
import { Button } from "@/components/ui/button";
import { Check, Trash, X } from "lucide-react";
import { useState } from "react";
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

interface FeedbackTableRowActionsProps {
  status: "pending" | "read" | "published";
  onApprove: (e: React.MouseEvent) => void;
  onUnapprove: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const FeedbackTableRowActions = ({
  status,
  onApprove,
  onUnapprove,
  onDelete,
}: FeedbackTableRowActionsProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAlertOpen(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete(new MouseEvent('click') as unknown as React.MouseEvent);
    setIsAlertOpen(false);
  };
  
  const handleApprove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onApprove(e);
  };
  
  const handleUnapprove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUnapprove(e);
  };

  return (
    <>
      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
        {status !== "published" ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={handleApprove}
            title="Publier"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Publier</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={handleUnapprove}
            title="Retirer la publication"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Retirer la publication</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={handleDelete}
          title="Supprimer"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Supprimer</span>
        </Button>
      </div>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce feedback ? Cette action ne peut pas être annulée.
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
    </>
  );
};
