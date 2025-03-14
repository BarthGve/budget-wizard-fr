
import { motion } from "framer-motion";
import { PiggyBank, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { NewSavingDialog } from "./NewSavingDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SavingsProjectWizard } from "./ProjectWizard/SavingsProjectWizard";
import { useState } from "react";

interface SavingsHeaderProps {
  onSavingAdded?: () => void;
  onProjectCreated?: () => void;
}

export const SavingsHeader = ({ onSavingAdded, onProjectCreated }: SavingsHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [newSavingDialogOpen, setNewSavingDialogOpen] = useState(false);
  const [showProjectWizard, setShowProjectWizard] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setNewSavingDialogOpen(open);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-4 pr-4 mb-2 flex items-center justify-between"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-2.5 rounded-lg shadow-sm mt-0.5",
            // Light mode
            "bg-gradient-to-br from-emerald-100 to-green-50",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-emerald-900/40 dark:to-green-800/30 dark:shadow-emerald-900/10"
          )}
        >
          <PiggyBank className={cn(
            "h-6 w-6",
            "text-emerald-600",
            "dark:text-emerald-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400",
            // Dark mode gradient
            "dark:bg-gradient-to-r dark:from-emerald-400 dark:via-green-400 dark:to-teal-300"
          )}>
            Épargne
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Prévoyez vos versements mensuels d'épargne
          </p>
        </div>
      </div>
      
      <div className="flex gap-3">
        {/* Bouton pour ajouter un versement mensuel */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            variant="outline"
            className={cn(
              "h-10 px-4 border transition-all duration-200 rounded-md",
              "hover:scale-[1.02] active:scale-[0.98]",
              // Light mode
              "bg-white border-emerald-200 text-emerald-600",
              "hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700",
              // Dark mode
              "dark:bg-gray-800 dark:border-emerald-800/60 dark:text-emerald-400",
              "dark:hover:bg-emerald-900/20 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 10px -2px rgba(16, 185, 129, 0.15)"
                : "0 2px 10px -2px rgba(16, 185, 129, 0.1)"
            }}
            onClick={() => setNewSavingDialogOpen(true)}
          >
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                // Light mode
                "bg-emerald-100/80 text-emerald-600",
                // Dark mode
                "dark:bg-emerald-800/50 dark:text-emerald-300"
              )}>
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="font-medium text-sm">Versement</span>
            </div>
          </Button>
          
          <NewSavingDialog 
            onSavingAdded={onSavingAdded} 
            open={newSavingDialogOpen}
            onOpenChange={handleDialogOpenChange}
          />
        </motion.div>
        
        {/* Bouton pour ajouter un projet */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            variant="outline"
            className={cn(
              "h-10 px-4 border transition-all duration-200 rounded-md",
              "hover:scale-[1.02] active:scale-[0.98]",
              // Light mode
              "bg-white border-emerald-200 text-emerald-600",
              "hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700",
              // Dark mode
              "dark:bg-gray-800 dark:border-emerald-800/60 dark:text-emerald-400",
              "dark:hover:bg-emerald-900/20 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 10px -2px rgba(16, 185, 129, 0.15)"
                : "0 2px 10px -2px rgba(16, 185, 129, 0.1)"
            }}
            onClick={() => setShowProjectWizard(true)}
          >
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                // Light mode
                "bg-emerald-100/80 text-emerald-600",
                // Dark mode
                "dark:bg-emerald-800/50 dark:text-emerald-300"
              )}>
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="font-medium text-sm">Projet</span>
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Project Wizard Dialog */}
      <Dialog open={showProjectWizard} onOpenChange={setShowProjectWizard}>
        <DialogContent className="max-w-4xl">
          <SavingsProjectWizard 
            onClose={() => setShowProjectWizard(false)} 
            onProjectCreated={() => {
              setShowProjectWizard(false);
              if (onProjectCreated) onProjectCreated();
            }} 
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
