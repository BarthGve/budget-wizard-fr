
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
  
  // Variantes d'animation pour un effet d'entrée élégant
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4",
        "relative z-10 p-4 sm:p-5 rounded-xl",
        "bg-secondary-50/30 dark:bg-secondary-950/30",
        "backdrop-blur-[2px]",
        "border border-secondary-100/50 dark:border-secondary-800/30",
        "shadow-sm shadow-secondary-200/20 dark:shadow-secondary-900/10"
      )}
    >
      <motion.div variants={itemVariants} className="flex items-start gap-3">
        <motion.div
          whileHover={{ 
            scale: 1.05, 
            rotate: 3,
            transition: { duration: 0.2 } 
          }}
          className={cn(
            "p-2.5 rounded-lg",
            "bg-gradient-to-br from-secondary-100 to-secondary-50/70",
            "dark:bg-gradient-to-br dark:from-secondary-800/40 dark:to-secondary-900/20",
            "border border-secondary-200/50 dark:border-secondary-700/30",
            "shadow-sm shadow-secondary-300/20 dark:shadow-secondary-900/20",
            "transform-gpu"
          )}
        >
          <LayoutDashboard className={cn(
            "h-6 w-6",
            "text-secondary-600 dark:text-secondary-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-xl sm:text-2xl font-bold tracking-tight",
            "bg-gradient-to-r from-secondary-600 via-secondary-500 to-violet-500 bg-clip-text text-transparent",
            "dark:bg-gradient-to-r dark:from-secondary-400 dark:via-secondary-300 dark:to-violet-400"
          )}>
            {currentView === "monthly" ? `Tableau de bord - ${currentMonthName}` : "Tableau de bord annuel"}
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-secondary-600/80 dark:text-secondary-400/90"
          )}>
            {currentView === "monthly" 
              ? "Vue mensuelle de vos finances" 
              : "Vue annuelle de vos finances"}
          </p>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex items-center space-x-2 w-full sm:w-auto">
        <SimulatorButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              className={cn(
                "min-w-[110px] justify-between transition-all duration-200",
                "bg-secondary-50/80 hover:bg-secondary-100/90 border-secondary-200/50",
                "dark:bg-secondary-900/40 dark:hover:bg-secondary-800/60 dark:border-secondary-700/40",
                "shadow-sm shadow-secondary-200/10 dark:shadow-secondary-900/5"
              )}
            >
              <Calendar className="mr-2 h-4 w-4 text-secondary-500 dark:text-secondary-400" />
              <span className="text-secondary-700 dark:text-secondary-300">
                {currentView === "monthly" ? "Mensuel" : "Annuel"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-70 text-secondary-500 dark:text-secondary-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={cn(
              "w-[200px] p-1",
              "bg-white/95 dark:bg-gray-900/95",
              "backdrop-blur-sm",
              "border border-secondary-100 dark:border-secondary-800/50"
            )}
          >
            <DropdownMenuRadioGroup
              value={currentView}
              onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
            >
              <DropdownMenuRadioItem 
                value="monthly"
                className="text-secondary-700 dark:text-secondary-300 focus:bg-secondary-50 dark:focus:bg-secondary-900/50"
              >
                Vue mensuelle
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem 
                value="yearly"
                className="text-secondary-700 dark:text-secondary-300 focus:bg-secondary-50 dark:focus:bg-secondary-900/50"
              >
                Vue annuelle
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.div>
  );
};
