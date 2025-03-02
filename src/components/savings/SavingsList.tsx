import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewSavingDialog } from "./NewSavingDialog";
import { AnimatePresence, motion } from "framer-motion";
import { SavingItem } from "./SavingItem";
import { DeleteSavingDialog } from "./DeleteSavingDialog";
import { EmptySavings } from "./EmptySavings";

interface SavingsListProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
  }>;
  onSavingDeleted: () => void;
  showSavings: boolean;
}

export const SavingsList = ({
  monthlySavings,
  onSavingDeleted,
  showSavings = true
}: SavingsListProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
  } | null>(null);
  const [editSaving, setEditSaving] = useState<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  } | null>(null);

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting saving with ID:", id);
      
      // If this saving is associated with a project, delete the project first
      if (selectedSaving?.is_project_saving) {
        console.log("This is a project saving. Project name:", selectedSaving.name);
        
        // Get the project information before deleting
        const { data: projectData, error: projectError } = await supabase
          .from('projets_epargne')
          .select('id')
          .eq('nom_projet', selectedSaving.name)
          .single();
          
        if (projectError) {
          console.error("Error fetching project:", projectError);
          if (projectError.code !== 'PGRST116') { // Not found error
            throw projectError;
          }
        }
        
        if (projectData) {
          console.log("Found project to delete with ID:", projectData.id);
          
          // Delete the project
          const { error: deleteProjectError } = await supabase
            .from('projets_epargne')
            .delete()
            .eq('id', projectData.id);

          if (deleteProjectError) {
            console.error("Error deleting project:", deleteProjectError);
            throw deleteProjectError;
          }
          
          console.log("Project deleted successfully");
        } else {
          console.log("No project found with name:", selectedSaving.name);
        }
      }
      
      // Now delete the monthly saving
      const { error } = await supabase.from("monthly_savings").delete().eq("id", id);
      if (error) {
        console.error("Error deleting saving:", error);
        throw error;
      }
      
      if (selectedSaving?.is_project_saving) {
        toast.success("Épargne et projet associé supprimés avec succès");
      } else {
        toast.success("Épargne supprimée avec succès");
      }
      
      onSavingDeleted();
      setShowDeleteDialog(false);
      setSelectedSaving(null);
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (saving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }) => {
    setEditSaving(saving);
  };

  const handleOpenDelete = (saving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
  }) => {
    setSelectedSaving(saving);
    setShowDeleteDialog(true);
  };

  const containerVariants = {
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    },
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        when: "afterChildren"
      }
    }
  };

  return (
    <div className="grid gap-2">
      <motion.div 
        className="mb-2"
        variants={containerVariants}
        initial="hidden"
        animate={showSavings ? "visible" : "hidden"}
      >
        <AnimatePresence mode="wait">
          {monthlySavings.map((saving) => (
            <SavingItem
              key={saving.id}
              saving={saving}
              onEdit={handleEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </AnimatePresence>
        
        {showSavings && monthlySavings.length === 0 && <EmptySavings />}
      </motion.div>

      <NewSavingDialog 
        saving={editSaving || undefined} 
        onSavingAdded={() => {
          onSavingDeleted();
          setEditSaving(null);
        }} 
        open={!!editSaving} 
        onOpenChange={open => {
          if (!open) setEditSaving(null);
        }} 
      />

      <DeleteSavingDialog
        open={showDeleteDialog}
        onOpenChange={open => {
          setShowDeleteDialog(open);
          if (!open) setSelectedSaving(null);
        }}
        onConfirm={() => selectedSaving && handleDelete(selectedSaving.id)}
        savingName={selectedSaving?.name}
        isProjectSaving={selectedSaving?.is_project_saving}
      />
    </div>
  );
};
