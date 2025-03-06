
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangelogEntryForm } from "./ChangelogEntryForm";
import { ChangelogEntry } from "./types";

interface ChangelogEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: ChangelogEntry | null;
}

export const ChangelogEntryDialog = ({ 
  isOpen, 
  onOpenChange, 
  entry 
}: ChangelogEntryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry ? "Modifier l'entrée" : "Nouvelle entrée"}
          </DialogTitle>
        </DialogHeader>
        <ChangelogEntryForm
          initialData={entry}
          onSuccess={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
