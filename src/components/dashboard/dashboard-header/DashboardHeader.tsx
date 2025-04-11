import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, LayoutDashboard, ChevronDown } from "lucide-react";
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
          className="p-3 rounded-xl shadow-sm bg-secondary/20 dark:bg-secondary/10 backdrop-blur-sm"
        >
          <LayoutDashboard className="h-6 w-6 text-secondary dark:text-secondary/90" />
        </motion.div>
        
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-secondary dark:text-secondary/90">
            {currentView === "monthly" ? `Tableau de bord - ${currentMonthName}` : "Tableau de bord annuel"}
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {currentView === "monthly" 
              ? "Vue mensuelle de vos finances" 
              : "Vue annuelle de vos finances"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <SimulatorButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              size={isMobile ? "sm" : "default"} 
              className="min-w-[120px] justify-between border-secondary/20 hover:border-secondary/50 dark:border-secondary/30 dark:hover:border-secondary/70 transition-all"
            >
              <Calendar className="mr-2 h-4 w-4 text-secondary dark:text-secondary/90" />
              <span className="text-secondary-foreground dark:text-secondary-foreground/90">
                {currentView === "monthly" ? "Mensuel" : "Annuel"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-70 text-secondary dark:text-secondary/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] border-secondary/20 dark:border-secondary/30">
            <DropdownMenuRadioGroup
              value={currentView}
              onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
            >
              <DropdownMenuRadioItem value="monthly" className="cursor-pointer hover:bg-secondary/10 dark:hover:bg-secondary/20 focus:bg-secondary/10 dark:focus:bg-secondary/20">
                Vue mensuelle
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="yearly" className="cursor-pointer hover:bg-secondary/10 dark:hover:bg-secondary/20 focus:bg-secondary/10 dark:focus:bg-secondary/20">
                Vue annuelle
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};