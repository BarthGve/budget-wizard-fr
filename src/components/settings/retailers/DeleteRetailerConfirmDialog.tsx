
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
import { Trash2 } from "lucide-react";

interface DeleteRetailerConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  retailerName: string;
}

export const DeleteRetailerConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  retailerName,
}: DeleteRetailerConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Supprimer l'enseigne
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">
              Êtes-vous sûr de vouloir supprimer l'enseigne <strong>{retailerName}</strong> ?
            </p>
            <p className="font-medium text-destructive">
              Attention : Toutes les dépenses associées à cette enseigne seront également supprimées.
            </p>
            <p className="mt-2">
              Cette action ne peut pas être annulée.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
