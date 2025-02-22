
import { SavingsProject } from "@/types/savings-project";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteProjectDialogProps {
  project: SavingsProject | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteProjectDialog = ({ project, onClose, onConfirm }: DeleteProjectDialogProps) => {
  if (!project) return null;

  return (
    <AlertDialog open={!!project} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement le projet
            {project.added_to_recurring && " et son versement mensuel associé"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
