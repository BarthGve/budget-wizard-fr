import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar,LayoutDashboard, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          
            "bg-gradient-to-br from-purple-100 to-violet-50",
            "dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-violet-800/30 dark:shadow-purple-900/10"
          )}
        >
          <LayoutDashboard className={cn(
            "h-6 w-6",
           "bg-primary/10 text-primary"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent",
            "bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400",
            "dark:bg-gradient-to-r dark:from-purple-400 dark:via-violet-400 dark:to-purple-300"
          )}>
            {currentView === "monthly" ? `Tableau de bord - ${currentMonthName}` : "Tableau de bord annuel"}
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            {currentView === "monthly" 
              ? "Vue mensuelle de vos finances" 
              : "Vue annuelle de vos finances"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <SimulatorButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              className={cn(
                "min-w-[110px] justify-between",
                "bg-purple-50 border-purple-100 hover:bg-purple-100",
                "dark:bg-purple-950/30 dark:border-purple-800/50 dark:hover:bg-purple-900/40"
              )}
            >
              <Calendar className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">{currentView === "monthly" ? "Mensuel" : "Annuel"}</span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50 text-purple-500 dark:text-purple-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup
              value={currentView}
              onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
            >
              <DropdownMenuRadioItem value="monthly">Vue mensuelle</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="yearly">Vue annuelle</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};