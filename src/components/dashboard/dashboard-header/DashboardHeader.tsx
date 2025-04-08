
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SimulatorButton } from "../simulator/SimulatorButton";
import { useIsMobile } from "@/hooks/use-mobile";

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
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          {currentView === "monthly" ? `Tableau de bord - ${currentMonthName}` : "Tableau de bord annuel"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {currentView === "monthly" 
            ? "Vue mensuelle de vos finances" 
            : "Vue annuelle de vos finances"}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <SimulatorButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={isMobile ? "sm" : "default"} className="min-w-[110px] justify-between">
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
              <DropdownMenuRadioItem value="monthly">Vue mensuelle</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="yearly">Vue annuelle</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
