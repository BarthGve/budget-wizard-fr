
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface DeleteSavingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  savingName?: string;
  isProjectSaving?: boolean;
}

export const DeleteSavingDialog = ({
  open,
  onOpenChange,
  onConfirm,
  savingName,
  isProjectSaving = false
}: DeleteSavingDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l&apos;épargne</AlertDialogTitle>
          <AlertDialogDescription>
            {isProjectSaving ? (
              <>
                <p>Attention : cette épargne est liée à un projet d'épargne "{savingName}".</p>
                <p className="mt-2">Supprimer ce versement mensuel n'affectera pas le projet associé, mais celui-ci ne bénéficiera plus de versements automatiques.</p>
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir supprimer cette épargne {savingName ? `"${savingName}"` : ""}? 
                Cette action ne peut pas être annulée.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
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
