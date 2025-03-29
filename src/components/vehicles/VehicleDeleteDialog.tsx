
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
import { Button } from "@/components/ui/button";

interface VehicleDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onMarkAsSold: () => void;
}

export const VehicleDeleteDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  onMarkAsSold,
}: VehicleDeleteDialogProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handleMarkAsSold = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsSold();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Gestion du véhicule</AlertDialogTitle>
          <AlertDialogDescription>
            Que souhaitez-vous faire avec ce véhicule ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleMarkAsSold}
              className="w-full"
            >
              Marquer comme vendu
            </Button>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Supprimer définitivement
            </AlertDialogAction>
          </div>
          <AlertDialogCancel className="mt-2 sm:mt-0">Annuler</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
