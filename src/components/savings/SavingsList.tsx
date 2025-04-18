
import { motion } from "framer-motion";
import { useSavingsDialogs } from "./hooks/useSavingsDialogs";
import { useSavingsRealtimeUpdates } from "./hooks/useSavingsRealtimeUpdates";
import { SavingsContainer } from "./components/SavingsContainer";
import { SavingsDialogs } from "./components/SavingsDialogs";
import { EmptySavingsState } from "./components/EmptySavingsState";
import { cn } from "@/lib/utils";

interface SavingsListProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
    projet_id?: string;
  }>;
  onSavingDeleted: () => void;
  showSavings: boolean;
}

export const SavingsList = ({
  monthlySavings,
  onSavingDeleted,
  showSavings = true,
}: SavingsListProps) => {
  const {
    showDeleteDialog,
    selectedSaving,
    editSaving,
    setShowDeleteDialog,
    setSelectedSaving,
    setEditSaving,
    handleDelete,
    handleEdit,
    handleOpenDelete
  } = useSavingsDialogs(onSavingDeleted);

  useSavingsRealtimeUpdates();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <motion.div className={cn("mb-2", showSavings ? "mb-4" : "mb-0")}>
        <SavingsContainer
          monthlySavings={monthlySavings}
          onEdit={handleEdit}
          onDelete={handleOpenDelete}
          showSavings={showSavings}
        />

        {showSavings && monthlySavings.length === 0 && <EmptySavingsState />}
      </motion.div>

      <SavingsDialogs
        showDeleteDialog={showDeleteDialog}
        selectedSaving={selectedSaving}
        editSaving={editSaving}
        onSavingDeleted={onSavingDeleted}
        onDeleteDialogChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setSelectedSaving(null);
        }}
        onConfirmDelete={handleDelete}
        setEditSaving={setEditSaving}
      />
    </motion.div>
  );
};
