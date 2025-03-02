
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
            {project.added_to_recurring ? (
              <>
                <p className="mb-2">Cette action est irréversible et aura les conséquences suivantes :</p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Suppression du projet d'épargne "{project.nom_projet}"</li>
                  <li>Suppression du versement mensuel associé ({project.montant_mensuel} € par mois)</li>
                </ul>
              </>
            ) : (
              <>
                Cette action est irréversible. Le projet "{project.nom_projet}" sera définitivement supprimé.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
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
