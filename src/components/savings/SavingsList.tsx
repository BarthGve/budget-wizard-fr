import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NewSavingDialog } from "./NewSavingDialog";
import { AnimatePresence, motion } from "framer-motion";
import { SavingItem } from "./SavingItem";
import { DeleteSavingDialog } from "./DeleteSavingDialog";
import { EmptySavings } from "./EmptySavings";
import { deleteSavingAndProject } from "./ProjectWizard/utils/projectUtils";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PiggyBank } from "lucide-react";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
    projet_id?: string;
  } | null>(null);
  const [editSaving, setEditSaving] = useState<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  } | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('monthly-savings-changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'monthly_savings'
        },
        (payload) => {
          console.log('Modification des épargnes mensuelles:', payload);
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting saving with ID:", id);

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
      console.error("Error in the delete process:", error);
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
        opacity: { duration: 0.3 },
      },
    },
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        when: "afterChildren",
      },
    },
  };

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
      variants={containerVariants}
    >
      <motion.div
        className={cn("mb-2", showSavings ? "mb-4" : "mb-0")}
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

        {showSavings && monthlySavings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full"
          >
            <div
              className={cn(
                "rounded-lg py-10 px-6 text-center",
                "bg-gradient-to-b from-gray-50 to-gray-100/80 border border-gray-200/70",
                "dark:bg-gradient-to-b dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 8px -2px rgba(0, 0, 0, 0.15)"
                  : "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div
                  className={cn(
                    "p-3 rounded-full",
                    "bg-gradient-to-br from-quaternary-100 to-quaternary-50",
                    "dark:bg-gradient-to-br dark:from-teal-900/40 dark:to-teal-800/30"
                  )}
                >
                  <PiggyBank/>
                </div>
                <h3
                  className={cn(
                    "text-lg font-medium bg-clip-text text-transparent",
                    "bg-gradient-to-r from-quaternary-600 via-teal-500 to-quaternary-500",
                    "dark:bg-gradient-to-r dark:from-quaternary-400 dark:via-quaternary-300 dark:to-quaternary-400"
                  )}
                >
                  Aucune épargne
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Vous n'avez pas défini d'épargne mensuelle. Ajoutez une épargne pour commencer.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

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
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setSelectedSaving(null);
        }}
        onConfirm={() => selectedSaving && handleDelete(selectedSaving.id)}
        savingName={selectedSaving?.name}
        isProjectSaving={selectedSaving?.is_project_saving}
      />
    </motion.div>
  );
};
