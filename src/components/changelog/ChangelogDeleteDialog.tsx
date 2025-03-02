
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { deleteChangelogEntry } from "@/services/changelog";

interface ChangelogDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entryId: string | null;
}

export const ChangelogDeleteDialog = ({ 
  isOpen, 
  onOpenChange, 
  entryId 
}: ChangelogDeleteDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteEntry } = useMutation({
    mutationFn: deleteChangelogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changelog"] });
      toast.success("Entrée supprimée avec succès");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error deleting changelog entry:", error);
      toast.error("Une erreur est survenue");
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    if (entryId) {
      deleteEntry(entryId);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. L'entrée sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
