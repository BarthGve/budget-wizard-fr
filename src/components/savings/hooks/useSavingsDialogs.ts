
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deleteSavingAndProject } from "../ProjectWizard/utils/projectUtils";

interface SavingType {
  id: string;
  name: string;
  amount: number;
  logo_url?: string;
  is_project_saving?: boolean;
  projet_id?: string;
}

export const useSavingsDialogs = (onSavingDeleted: () => void) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<SavingType | null>(null);
  const [editSaving, setEditSaving] = useState<SavingType | null>(null);

  const handleDelete = async (id: string) => {
    try {
      console.log("Suppression de l'épargne avec l'ID:", id);

      if (selectedSaving?.is_project_saving) {
        await deleteSavingAndProject(
          id,
          true,
          selectedSaving.projet_id
        );
        toast.success("Épargne et projet associé supprimés avec succès");
      } else {
        await deleteSavingAndProject(id, false);
        toast.success("Épargne supprimée avec succès");
      }

      onSavingDeleted();
      setShowDeleteDialog(false);
      setSelectedSaving(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (saving: SavingType) => {
    setEditSaving(saving);
  };

  const handleOpenDelete = (saving: SavingType) => {
    setSelectedSaving(saving);
    setShowDeleteDialog(true);
  };

  return {
    showDeleteDialog,
    selectedSaving,
    editSaving,
    setShowDeleteDialog,
    setSelectedSaving,
    setEditSaving,
    handleDelete,
    handleEdit,
    handleOpenDelete
  };
};
