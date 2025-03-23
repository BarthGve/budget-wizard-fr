
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VehicleFormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  isUploading: boolean;
  isEditMode: boolean;
}

export const VehicleFormActions = ({ 
  onCancel, 
  isPending, 
  isUploading,
  isEditMode 
}: VehicleFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isPending || isUploading}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditMode ? 'Mettre à jour' : 'Ajouter'} le véhicule
      </Button>
    </div>
  );
};
