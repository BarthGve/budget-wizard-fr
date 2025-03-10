import { useState } from "react";
import { RecurringExpense } from "./types";
import { RecurringExpenseDialog } from "./RecurringExpenseDialog";
import { RecurringExpenseDetails } from "./RecurringExpenseDetails";
import { DeleteExpenseDialog } from "./dialogs/DeleteExpenseDialog";
import { ExpenseActionsDropdown } from "./dialogs/ExpenseActionsDropdown";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface TableRowActionsProps {
  expense: RecurringExpense;
  onDeleteExpense: (id: string) => Promise<void>;
  compact?: boolean;
}

export const TableRowActions = ({ 
  expense, 
  onDeleteExpense, 
  compact = false 
}: TableRowActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleDelete = async () => {
    await onDeleteExpense(expense.id);
    setShowDeleteDialog(false);
  };

  // Animation variants pour les transitions
  const actionButtonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  // En mode compact, on utilise le dropdown, sinon on affiche les boutons individuels
  return (
    <>
      {compact ? (
        <ExpenseActionsDropdown
          onViewDetails={() => setShowDetailsDialog(true)}
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => setShowDeleteDialog(true)}
        />
      ) : (
        <div className="flex items-center justify-end gap-1.5">
          <TooltipProvider delayDuration={300}>
            {/* Bouton de visualisation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => setShowDetailsDialog(true)}
                  variants={actionButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-md transition-colors",
                    // Light mode
                    "hover:bg-blue-50 text-gray-500 hover:text-blue-600",
                    // Dark mode
                    "dark:hover:bg-blue-900/20 dark:text-gray-400 dark:hover:text-blue-400",
                    // Focus state
                    "focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50"
                  )}
                >
                  <Eye size={16} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border-0",
                  "bg-gray-800 text-gray-100",
                  "dark:bg-gray-700"
                )}
              >
                Voir les détails
              </TooltipContent>
            </Tooltip>
            
            {/* Bouton d'édition */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => setShowEditDialog(true)}
                  variants={actionButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-md transition-colors",
                    // Light mode
                    "hover:bg-blue-50 text-gray-500 hover:text-blue-600",
                    // Dark mode
                    "dark:hover:bg-blue-900/20 dark:text-gray-400 dark:hover:text-blue-400",
                    // Focus state
                    "focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50"
                  )}
                >
                  <Edit size={16} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border-0",
                  "bg-gray-800 text-gray-100",
                  "dark:bg-gray-700"
                )}
              >
                Modifier
              </TooltipContent>
            </Tooltip>
            
            {/* Bouton de suppression */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => setShowDeleteDialog(true)}
                  variants={actionButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-md transition-colors",
                    // Light mode
                    "hover:bg-red-50 text-gray-500 hover:text-red-600",
                    // Dark mode
                    "dark:hover:bg-red-900/20 dark:text-gray-400 dark:hover:text-red-400",
                    // Focus state
                    "focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800/50"
                  )}
                >
                  <Trash2 size={16} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border-0",
                  "bg-gray-800 text-gray-100",
                  "dark:bg-gray-700"
                )}
              >
                Supprimer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Dialog pour afficher les détails */}
      <Dialog 
        open={showDetailsDialog} 
        onOpenChange={setShowDetailsDialog}
      >
        <RecurringExpenseDetails expense={expense} />
      </Dialog>

      {/* Dialog pour éditer l'expense */}
      <RecurringExpenseDialog 
        expense={expense}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Dialog pour confirmer la suppression */}
      <DeleteExpenseDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDelete}
        expenseName={expense.name}
      />
    </>
  );
};

// Version améliorée du dropdown d'actions
export const ExpenseActionsDropdownEnhanced = ({
  onViewDetails,
  onEdit,
  onDelete,
}: {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-8 w-8 p-0 rounded-md transition-colors",
          // Light mode
          "hover:bg-gray-100 text-gray-500",
          // Dark mode
          "dark:hover:bg-gray-800 dark:text-gray-400",
          // Focus state
          "focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50",
          // Active state
          isOpen && "bg-gray-100 dark:bg-gray-800"
        )}
      >
        <MoreVertical size={16} />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer au clic extérieur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute right-0 mt-1 z-50 min-w-[160px] overflow-hidden rounded-md",
                "border shadow-lg",
                // Light mode
                "bg-white border-gray-200",
                // Dark mode
                "dark:bg-gray-800 dark:border-gray-700"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  : "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onViewDetails();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-sm transition-colors",
                    // Light mode
                    "hover:bg-gray-50 text-gray-700",
                    // Dark mode
                    "dark:hover:bg-gray-700/50 dark:text-gray-200"
                  )}
                >
                  <Eye className="mr-2.5 h-3.5 w-3.5" />
                  Voir les détails
                </button>
                
                <button
                  onClick={() => {
                    onEdit();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-sm transition-colors",
                    // Light mode
                    "hover:bg-gray-50 text-gray-700",
                    // Dark mode
                    "dark:hover:bg-gray-700/50 dark:text-gray-200"
                  )}
                >
                  <Edit className="mr-2.5 h-3.5 w-3.5" />
                  Modifier
                </button>
                
                <div className={cn(
                  "h-px my-1 mx-3",
                  "bg-gray-100 dark:bg-gray-700"
                )} />
                
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-sm transition-colors",
                    // Light mode
                    "hover:bg-red-50 text-red-600",
                    // Dark mode
                    "dark:hover:bg-red-900/20 dark:text-red-400"
                  )}
                >
                  <Trash2 className="mr-2.5 h-3.5 w-3.5" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
