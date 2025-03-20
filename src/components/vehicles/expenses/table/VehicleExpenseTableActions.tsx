
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface VehicleExpenseTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const VehicleExpenseTableActions = ({
  onEdit,
  onDelete
}: VehicleExpenseTableActionsProps) => {
  // État pour contrôler l'ouverture du menu déroulant
  const [isOpen, setIsOpen] = useState(false);
  
  // Fonction pour fermer proprement le menu après une action
  const handleEditClick = () => {
    setIsOpen(false); // Fermer le menu après clic
    onEdit();
  };
  
  // La suppression sera gérée par le AlertDialog

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <span className="sr-only">Actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cn(
          "w-[160px]",
          // Light mode
          "border-gray-200 bg-white",
          // Dark mode
          "dark:border-gray-800 dark:bg-gray-900"
        )}>
          <DropdownMenuItem
            onClick={handleEditClick}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Modifier</span>
          </DropdownMenuItem>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  // Empêcher que l'événement onSelect ferme le menu avant que l'utilisateur puisse voir la boîte de dialogue
                  e.preventDefault();
                  // Fermer le menu dropdown pour éviter les problèmes d'interface
                  setIsOpen(false);
                }}
                className="cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
