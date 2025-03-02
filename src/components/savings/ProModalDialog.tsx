
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ProModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProModalDialog = ({ open, onOpenChange }: ProModalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fonctionnalité Pro</DialogTitle>
          <DialogDescription>
            La création de projets d'épargne est une fonctionnalité réservée aux utilisateurs Pro. 
            Passez à la version Pro pour accéder à cette fonctionnalité et à bien d'autres avantages.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
