import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, HandCoins, SquarePen, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { NewSavingDialog } from "./NewSavingDialog";
import { AnimatePresence, motion } from "framer-motion";

interface SavingsListProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
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
  } | null>(null);
  const [editSaving, setEditSaving] = useState<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  } | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from("monthly_savings").delete().eq("id", id);
      if (error) throw error;
      toast.success("Épargne supprimée avec succès");
      onSavingDeleted();
      setShowDeleteDialog(false);
      setSelectedSaving(null);
    } catch (error) {
      console.error("Error deleting saving:", error);
      toast.error("Erreur lors de la suppression de l'épargne");
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

  const itemVariants = {
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4
      }
    },
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.8,
      height: 0,
      margin: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.3
      }
    }
  };

  return <div className="grid gap-2">
      <motion.div 
        className="overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={showSavings ? "visible" : "hidden"}
      >
        <AnimatePresence mode="wait">
          {monthlySavings.map((saving, index) => (
            <motion.div 
              key={saving.id} 
              variants={itemVariants}
              custom={index}
              className="flex items-center justify-between p-2 border rounded-lg bg-card dark:bg-card mb-2"
            >
              <div className="flex items-center gap-4">
                <img src={saving.logo_url || "/placeholder.svg"} alt={saving.name} className="w-10 h-10 rounded-full object-contain" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }} />
                <div>
                  <h4 className="font-medium">{saving.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(saving.amount)} / mois
                  </p>
                </div>
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => handleEdit(saving)}>
                    <SquarePen className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDelete(saving)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {showSavings && monthlySavings.length === 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-muted-foreground py-4"
          >
            Aucune épargne enregistrée
          </motion.p>
        )}
      </motion.div>

      <NewSavingDialog saving={editSaving || undefined} onSavingAdded={() => {
        onSavingDeleted();
        setEditSaving(null);
      }} open={!!editSaving} onOpenChange={open => {
        if (!open) setEditSaving(null);
      }} />

      <AlertDialog open={showDeleteDialog} onOpenChange={open => {
        setShowDeleteDialog(open);
        if (!open) setSelectedSaving(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;épargne</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette épargne ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedSaving && handleDelete(selectedSaving.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
