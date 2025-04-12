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
            "text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent",
            "bg-gradient-to-r from-primary to-primary/50",
          
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
        
       <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="outline" 
      size={isMobile ? "sm" : "default"} 
      className={cn(
        "min-w-[110px] justify-between",
        "bg-primary/10 hover:bg-primary/20",
        "text-primary border-primary/20",
        "transition-colors",
        isMobile ? "text-xs px-2 py-1.5" : "px-3 py-2"
      )}
    >
      <Calendar className={cn(
        "mr-2",
        isMobile ? "h-3 w-3" : "h-4 w-4",
        "text-primary"
      )} />
      <span>{currentView === "monthly" ? "Mensuel" : "Annuel"}</span>
      <ChevronDown className={cn(
        "ml-2",
        isMobile ? "h-3 w-3" : "h-4 w-4",
        "opacity-50 text-primary"
      )} />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className={cn(
      "w-[220px] rounded-md border border-primary/20",
      "bg-white shadow-lg dark:bg-gray-950 dark:border-gray-800",
      "focus:outline-none"
    )}
  >
    <DropdownMenuRadioGroup
      value={currentView}
      onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
    >
      <DropdownMenuRadioItem
        value="monthly"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer",
          "text-sm text-foreground hover:bg-primary/10",
          "focus:bg-primary/20 focus:outline-none transition-colors"
        )}
      >
        Vue mensuelle
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem
        value="yearly"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer",
          "text-sm text-foreground hover:bg-primary/10",
          "focus:bg-primary/20 focus:outline-none transition-colors"
        )}
      >
        Vue annuelle
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
    </motion.div>
  );
};