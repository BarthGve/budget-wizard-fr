
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon, ShoppingCart } from "lucide-react";

type VehicleDeleteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onMarkAsSold: () => void;
};

export const VehicleDeleteDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  onMarkAsSold,
}: VehicleDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Action sur le véhicule</AlertDialogTitle>
          <AlertDialogDescription>
            Que souhaitez-vous faire avec ce véhicule ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600"
            onClick={() => {
              onMarkAsSold();
              onOpenChange(false);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Marquer comme vendu
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete();
              onOpenChange(false);
            }}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Supprimer définitivement
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
