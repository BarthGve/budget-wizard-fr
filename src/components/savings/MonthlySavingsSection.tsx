
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsList } from "@/components/savings/SavingsList";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

interface MonthlySavingsSectionProps {
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  }> | null;
  onSavingDeleted: () => void;
  onSavingAdded: () => void;
  showInitial?: boolean;
}

export const MonthlySavingsSection = ({ 
  monthlySavings, 
  onSavingDeleted, 
  onSavingAdded,
  showInitial = true
}: MonthlySavingsSectionProps) => {
  const [showMonthlySavings, setShowMonthlySavings] = useState(showInitial);
  const [newSavingDialogOpen, setNewSavingDialogOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleMonthlySavingsVisibility = () => {
    setShowMonthlySavings(prev => !prev);
  };
  
  const handleOpenNewSavingDialog = () => {
    setNewSavingDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setNewSavingDialogOpen(open);
  };

  return (
    <motion.div 
      className="flex-none mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 bg-clip-text text-transparent dark:from-emerald-400 dark:via-green-400 dark:to-teal-300 animate-fade-in text-2xl">Versements mensuels</h2>
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMonthlySavingsVisibility}
              className={cn(
                "transition-all duration-300 rounded-full hover:bg-primary/10", 
                showMonthlySavings ? "bg-primary/5" : ""
              )}
            >
              {showMonthlySavings ? 
                <ChevronUp className="h-4 w-4 transition-all duration-300 transform" /> : 
                <ChevronDown className="h-4 w-4 transition-all duration-300 transform" />
              }
            </Button>
          </motion.div>
        </div>
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
            onClick={handleOpenNewSavingDialog}
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
              <span className="font-medium text-sm">Ajouter</span>
            </div>
          </Button>
          
          <NewSavingDialog 
            onSavingAdded={onSavingAdded} 
            open={newSavingDialogOpen}
            onOpenChange={handleDialogOpenChange}
          />
        </motion.div>
      </div>
      <SavingsList 
        monthlySavings={monthlySavings || []} 
        onSavingDeleted={onSavingDeleted} 
        showSavings={showMonthlySavings} 
      />
    </motion.div>
  );
};
