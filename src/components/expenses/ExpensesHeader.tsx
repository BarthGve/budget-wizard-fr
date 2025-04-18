
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { ShoppingBasket, LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ExpensesHeaderProps {
  viewMode: 'monthly' | 'yearly';
  setViewMode: (mode: 'monthly' | 'yearly') => void;
  onExpenseAdded: () => void;
  displayMode: 'grid' | 'list';
  setDisplayMode: (mode: 'grid' | 'list') => void;
}

export const ExpensesHeader = ({ 
  viewMode, 
  setViewMode, 
  onExpenseAdded, 
  displayMode, 
  setDisplayMode 
}: ExpensesHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  
  // Utiliser useMediaQuery pour détecter les écrans mobiles
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Fonction pour gérer le changement de mode de vue
  const handleViewModeChange = (checked: boolean) => {
    setViewMode(checked ? 'yearly' : 'monthly');
  };
  
  return (
    <motion.div 
      className="pb-4 mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={cn(
        "flex flex-col gap-4",
        isMobile ? "" : "flex-row justify-between items-center"
      )}>
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={cn(
              "p-2.5 rounded-lg shadow-sm mt-0.5",
              "bg-gradient-to-br from-tertiary/20 to-tertiary/10", 
              "dark:bg-gradient-to-br dark:from-tertiary/40 dark:to-tertiary/30 dark:shadow-tertiary/10"
            )}
          >
            <ShoppingBasket className={cn(
              "h-6 w-6",
              "text-tertiary", 
              "dark:text-tertiary"
            )} />
          </motion.div>
        
          <div>
            <h1 className={cn(
              "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
              "bg-gradient-to-r from-tertiary via-tertiary/90 to-tertiary/70", 
              "dark:bg-gradient-to-r dark:from-tertiary/60 dark:via-tertiary/50 dark:to-tertiary/40"
            )}>
              Dépenses
            </h1>
            <p className={cn(
              "text-sm mt-1",
              "text-gray-500",
              "dark:text-gray-400"
            )}>
              Suivez les dépenses que vous réalisez auprès de certaines enseignes
            </p>
          </div>
        </div>
    
        <div className={cn(
          "flex flex-col sm:flex-row items-center gap-3",
          isMobile ? "w-full" : "gap-4"
        )}>
          <motion.div 
            className={cn(
              "flex items-center p-1 rounded-full",
              "bg-tertiary/5 border border-tertiary/20 dark:bg-tertiary/10 dark:border-tertiary/30"
            )}
          >
            <Switch
              id="dashboard-view-mode"
              checked={viewMode === 'yearly'}
              onCheckedChange={handleViewModeChange}
              className="data-[state=checked]:bg-tertiary dark:data-[state=checked]:bg-tertiary"
            />
            
            <div className="flex items-center space-x-2 px-3">
              <Label 
                htmlFor="dashboard-view-mode" 
                className={`${viewMode === 'yearly' ? 'text-tertiary font-medium dark:text-tertiary-300' : 'text-gray-400 dark:text-gray-500'} transition-colors text-sm`}
              >
                Vue annuelle
              </Label>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ToggleGroup 
              type="single" 
              value={displayMode}
              onValueChange={(value) => {
                if (value) setDisplayMode(value as 'grid' | 'list');
              }}
              className="bg-gray-100/80 dark:bg-gray-800/80 rounded-full border border-gray-200/50 dark:border-gray-700/50 p-1"
            >
              <ToggleGroupItem 
                value="grid" 
                className={cn(
                  "rounded-full w-8 h-8 p-0 flex items-center justify-center",
                  displayMode === 'grid' && "bg-tertiary text-white dark:bg-tertiary dark:text-white"
                )}
                aria-label="Affichage en grille"
              >
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="list" 
                className={cn(
                  "rounded-full w-8 h-8 p-0 flex items-center justify-center",
                  displayMode === 'list' && "bg-tertiary text-white dark:bg-tertiary dark:text-white"
                )}
                aria-label="Affichage en liste"
              >
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </motion.div>
          
          <AddExpenseDialog 
            onExpenseAdded={onExpenseAdded} 
            open={addExpenseDialogOpen} 
            onOpenChange={setAddExpenseDialogOpen} 
          />
        </div>
      </div>
    </motion.div>
  );
};
