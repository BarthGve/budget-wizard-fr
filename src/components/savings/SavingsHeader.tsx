
import { motion } from "framer-motion";
import { PiggyBank, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { NewSavingDialog } from "./NewSavingDialog";
import { SavingsProjectWizard } from "./ProjectWizard/SavingsProjectWizard";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SavingsHeaderProps {
  onSavingAdded?: () => void;
  onProjectCreated?: () => void;
}

export const SavingsHeader = ({ onSavingAdded, onProjectCreated }: SavingsHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [newSavingDialogOpen, setNewSavingDialogOpen] = useState(false);
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const isMobile = useIsMobile();

  const handleDialogOpenChange = (open: boolean) => {
    setNewSavingDialogOpen(open);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-4 pr-0 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-2.5 rounded-lg shadow-sm mt-0.5",
            "bg-gradient-to-br from-quaternary-100 to-green-50",
            "dark:bg-gradient-to-br dark:from-quaternary-900/40 dark:to-green-800/30 dark:shadow-quaternary-900/10"
          )}
        >
          <PiggyBank className={cn(
            "h-6 w-6",
            "text-quaternary-600",
            "dark:text-quaternary-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            "bg-gradient-to-r from-quaternary-500 via-green-500 to-teal-400",
            "dark:bg-gradient-to-r dark:from-quaternary-400 dark:via-green-400 dark:to-teal-300"
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
      
      <div className={cn(
        "flex gap-3",
        isMobile ? "w-full justify-between" : ""
      )}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          className={isMobile ? "flex-1" : ""}
        >
          <Button 
            variant="outline"
            className={cn(
              "h-10 px-3 md:px-4 border transition-all duration-200 rounded-md w-full md:w-auto",
              "hover:scale-[1.02] active:scale-[0.98]",
              "bg-white border-quaternary-200 text-quaternary-600",
              "hover:border-quaternary-300 hover:bg-quaternary-50/50 hover:text-quaternary-700",
              "dark:bg-gray-800 dark:border-quaternary-800/60 dark:text-quaternary-400",
              "dark:hover:bg-quaternary-900/20 dark:hover:border-quaternary-700 dark:hover:text-quaternary-300"
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
                "bg-quaternary-100/80 text-quaternary-600",
                "dark:bg-quaternary-800/50 dark:text-quaternary-300"
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
        
        <motion.div
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          className={isMobile ? "flex-1" : ""}
        >
          <Button 
            variant="outline"
            className={cn(
              "h-10 px-3 md:px-4 border transition-all duration-200 rounded-md w-full md:w-auto",
              "hover:scale-[1.02] active:scale-[0.98]",
              "bg-white border-quaternary-200 text-quaternary-600",
              "hover:border-quaternary-300 hover:bg-quaternary-50/50 hover:text-quaternary-700",
              "dark:bg-gray-800 dark:border-quaternary-800/60 dark:text-quaternary-400",
              "dark:hover:bg-quaternary-900/20 dark:hover:border-quaternary-700 dark:hover:text-quaternary-300"
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
                "bg-quaternary-100/80 text-quaternary-600",
                "dark:bg-quaternary-800/50 dark:text-quaternary-300"
              )}>
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="font-medium text-sm">Projet</span>
            </div>
          </Button>
        </motion.div>
      </div>

      {showProjectWizard && (
        <SavingsProjectWizard 
          onClose={() => setShowProjectWizard(false)} 
          onProjectCreated={() => {
            if (onProjectCreated) onProjectCreated();
            setShowProjectWizard(false);
          }} 
        />
      )}
    </motion.div>
  );
};
