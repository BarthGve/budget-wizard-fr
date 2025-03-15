
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SavingForm } from "./SavingForm";

interface NewSavingDialogProps {
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  };
  onSavingAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewSavingDialog = ({
  saving,
  onSavingAdded,
  open = false,
  onOpenChange,
}: NewSavingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{saving ? 'Modifier' : 'Ajouter'} un versement d'épargne</DialogTitle>
        </DialogHeader>
        <SavingForm 
          saving={saving} 
          onSavingAdded={() => {
            if (onSavingAdded) onSavingAdded();
            if (onOpenChange) onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};
