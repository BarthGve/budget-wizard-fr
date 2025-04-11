import React from "react";
import { cn } from "@/lib/utils";
import { Info, FileIcon, ClipboardList, ChevronLeft, BarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  canAccessExpenses: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange,
  canAccessExpenses,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  if (!isMobile) return null;
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900",
        "p-2 mb-4 border-b border-gray-200 dark:border-gray-800",
        "shadow-sm ios-top-safe flex flex-col"
      )}
    >
      <div className="flex items-center justify-between px-3 ">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 px-1" 
            onClick={() => navigate('/vehicles')}
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-sm font-medium truncate">Détail du véhicule</h1>
        </div>
      </div>
      
      <Tabs
        value={activeSection}
        onValueChange={onSectionChange}
        className="w-full"
      >
        <TabsList className="flex justify-between p-1 overflow-x-auto scrollbar-none">
          <TabsTrigger
            value="details"
            asChild
          >
            <Button
              variant={activeSection === "details" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-1.5 flex-1",
                activeSection !== "details" && "text-gray-600 dark:text-gray-400"
              )}
            >
              <Info className="h-4 w-4" />
              <span className="text-xs">Détails</span>
            </Button>
          </TabsTrigger>
          
          {canAccessExpenses && (
            <TabsTrigger
              value="expenses"
              asChild
            >
              <Button
                variant={activeSection === "expenses" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex items-center gap-1.5 flex-1",
                  activeSection !== "expenses" && "text-gray-600 dark:text-gray-400"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                <span className="text-xs">Dépenses</span>
              </Button>
            </TabsTrigger>
          )}
          
          <TabsTrigger
            value="statistics"
            asChild
          >
            <Button
              variant={activeSection === "statistics" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-1.5 flex-1",
                activeSection !== "statistics" && "text-gray-600 dark:text-gray-400"
              )}
            >
              <BarChart className="h-4 w-4" />
              <span className="text-xs">Stats</span>
            </Button>
          </TabsTrigger>
          
          <TabsTrigger
            value="documents"
            asChild
          >
            <Button
              variant={activeSection === "documents" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-1.5 flex-1",
                activeSection !== "documents" && "text-gray-600 dark:text-gray-400"
              )}
            >
              <FileIcon className="h-4 w-4" />
              <span className="text-xs">Documents</span>
            </Button>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
};