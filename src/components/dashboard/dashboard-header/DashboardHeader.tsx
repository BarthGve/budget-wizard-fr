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

  const DashboardHeader = ({ 
  currentView, 
  setCurrentView, 
  currentMonthName, 
  isMobile 
}) => {
  // Animation variants for consistent animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
    };
  
    return (
    <motion.div 
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
      variants={containerVariants}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      {/* Left section with icon and title */}
      <div className="flex items-start gap-3">
        <motion.div
          variants={iconVariants}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-3 rounded-lg shadow-md",
            "bg-secondary/15",
            "dark:bg-secondary/20",
            "ring-1 ring-secondary/10 dark:ring-secondary/30"
          )}
        >
          <LayoutDashboard className={cn(
            "h-5 w-5",
            "text-secondary-600 dark:text-secondary-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-xl sm:text-2xl font-bold tracking-tight",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-secondary-600 via-secondary-500 to-secondary-700",
            "dark:bg-gradient-to-r dark:from-secondary-400 dark:via-secondary-300 dark:to-secondary-500"
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
      
      {/* Right section with buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <SimulatorButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              className={cn(
                "min-w-[110px] justify-between",
                "bg-secondary/10 hover:bg-secondary/20",
                "text-secondary-700 dark:text-secondary-300",
                "border-secondary-200 dark:border-secondary-800",
                "hover:border-secondary-300 dark:hover:border-secondary-700"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>{currentView === "monthly" ? "Mensuel" : "Annuel"}</span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup
              value={currentView}
              onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
            >
              <DropdownMenuRadioItem value="monthly" className="cursor-pointer">Vue mensuelle</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="yearly" className="cursor-pointer">Vue annuelle</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};