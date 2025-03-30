
import React from "react";
import { cn } from "@/lib/utils";
import { Info, FileIcon, ClipboardList, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList } from "@/components/ui/tabs";

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  canAccessExpenses: boolean;
}

export const MobileNavigation = ({
  activeSection,
  onSectionChange,
  canAccessExpenses,
}: MobileNavigationProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  if (!isMobile) return null;
  
  const handleGoBack = () => {
    navigate('/vehicles');
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900",
      "border-b border-gray-200 dark:border-gray-800",
      "shadow-sm ios-top-safe flex flex-col"
    )}>
      <div className="flex items-center px-3 py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 px-1" 
          onClick={handleGoBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-sm font-medium truncate">Détail du véhicule</div>
      </div>
      
      <Tabs value={activeSection} onValueChange={onSectionChange} className="w-full">
        <TabsList className="flex justify-between p-1 overflow-x-auto scrollbar-none">
          <Button
            variant={activeSection === "details" ? "default" : "ghost"}
            size="sm"
            className={cn("flex items-center gap-1.5 flex-1", activeSection !== "details" && "text-gray-600 dark:text-gray-400")}
            onClick={() => onSectionChange("details")}
          >
            <Info className="h-4 w-4" />
            <span className="text-xs">Détails</span>
          </Button>
          
          {canAccessExpenses && (
            <Button
              variant={activeSection === "expenses" ? "default" : "ghost"}
              size="sm"
              className={cn("flex items-center gap-1.5 flex-1", activeSection !== "expenses" && "text-gray-600 dark:text-gray-400")}
              onClick={() => onSectionChange("expenses")}
            >
              <ClipboardList className="h-4 w-4" />
              <span className="text-xs">Dépenses</span>
            </Button>
          )}
          
          <Button
            variant={activeSection === "documents" ? "default" : "ghost"}
            size="sm"
            className={cn("flex items-center gap-1.5 flex-1", activeSection !== "documents" && "text-gray-600 dark:text-gray-400")}
            onClick={() => onSectionChange("documents")}
          >
            <FileIcon className="h-4 w-4" />
            <span className="text-xs">Documents</span>
          </Button>
        </TabsList>
      </Tabs>
    </div>
  );
};
