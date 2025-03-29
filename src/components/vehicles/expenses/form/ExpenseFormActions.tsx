
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ExpenseFormActionsProps {
  isLoading: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export const ExpenseFormActions = ({ isLoading, isEditMode }: ExpenseFormActionsProps) => {
  return (
    <div className="pt-4">
      <Button 
        type="submit" 
        disabled={isLoading}
        variant="outline"
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditMode ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </div>
  );
};
