
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ExpenseFormActionsProps {
  isLoading: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export const ExpenseFormActions = ({ isLoading, isEditMode, onCancel }: ExpenseFormActionsProps) => {
  // Fonction explicite pour gérer l'annulation avec preventDefault
  const handleCancel = (e: React.MouseEvent) => {
    // Empêcher le comportement par défaut du bouton
    e.preventDefault();
    
    // Appeler le callback d'annulation
    onCancel();
  };

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
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
