
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ExpenseFormActionsProps {
  isLoading: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export const ExpenseFormActions = ({ isLoading, isEditMode, onCancel }: ExpenseFormActionsProps) => {
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
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditMode ? 'Mettre à jour' : 'Ajouter'} la dépense
      </Button>
    </div>
  );
};
