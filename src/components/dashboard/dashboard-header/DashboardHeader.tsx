
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SimulatorButton } from "../simulator/SimulatorButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  currentView: "monthly" | "yearly";
  setCurrentView: (view: "monthly" | "yearly") => void;
  currentMonthName: string;
}

export const DashboardHeader = ({
  currentView,
  setCurrentView,
  currentMonthName,
}: DashboardHeaderProps) => {
  const isMobile = useIsMobile();
  
  const handleViewModeChange = (checked: boolean) => {
    setCurrentView(checked ? "yearly" : "monthly");
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-2.5 rounded-lg shadow-sm mt-0.5",
            "bg-primary/10",
         
          )}
        >
          <LayoutDashboard className={cn(
            "h-6 w-6",
           "bg-primary/10 text-primary"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent",
            "bg-gradient-to-r from-primary to-primary",
          
          )}>
            {currentView === "monthly" ? `Tableau de bord - ${currentMonthName}` : "Tableau de bord annuel"}
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-muted-foreground"
          )}>
            {currentView === "monthly" 
              ? "Vue mensuelle de vos finances" 
              : "Vue annuelle de vos finances"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <SimulatorButton />
        
        <motion.div 
          className={cn(
            "flex items-center p-1 rounded-full",
            "bg-primary/5 border border-primary/20 dark:bg-primary/10 dark:border-primary/30"
          )}
        >
      
          
          <Switch
            id="dashboard-view-mode"
            checked={currentView === 'yearly'}
            onCheckedChange={handleViewModeChange}
            className="data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary"
          />
          
          <div className="flex items-center space-x-2 px-3">
            <Label 
              htmlFor="dashboard-view-mode" 
              className={`${currentView === 'yearly' ? 'text-primary font-medium dark:text-primary-300' : 'text-gray-400 dark:text-gray-500'} transition-colors text-sm`}
            >
              Vue annuelle
            </Label>
        
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
