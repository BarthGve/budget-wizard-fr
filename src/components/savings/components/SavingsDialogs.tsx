
import { NewSavingDialog } from "../NewSavingDialog";
import { DeleteSavingDialog } from "../DeleteSavingDialog";

interface SavingsDialogsProps {
  showDeleteDialog: boolean;
  selectedSaving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
  } | null;
  editSaving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  } | null;
  onSavingDeleted: () => void;
  onDeleteDialogChange: (open: boolean) => void;
  onConfirmDelete: (id: string) => void;
  setEditSaving: (saving: any) => void;
}

export const SavingsDialogs = ({
  showDeleteDialog,
  selectedSaving,
  editSaving,
  onSavingDeleted,
  onDeleteDialogChange,
  onConfirmDelete,
  setEditSaving
}: SavingsDialogsProps) => {
  return (
    <>
      <NewSavingDialog
        saving={editSaving || undefined}
        onSavingAdded={() => {
          onSavingDeleted();
          setEditSaving(null);
        }}
        open={!!editSaving}
        onOpenChange={(open) => {
          if (!open) setEditSaving(null);
        }}
      />

      <DeleteSavingDialog
        open={showDeleteDialog}
        onOpenChange={onDeleteDialogChange}
        onConfirm={() => selectedSaving && onConfirmDelete(selectedSaving.id)}
        savingName={selectedSaving?.name}
        isProjectSaving={selectedSaving?.is_project_saving}
      />
    </>
  );
};
