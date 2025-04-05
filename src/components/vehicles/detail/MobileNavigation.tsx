
import React from "react";
import { cn } from "@/lib/utils";
import { Info, FileIcon, ClipboardList, ChevronLeft, BarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

  // Définir les sections disponibles
  const sections = [
    { id: "details", icon: <Info className="h-4 w-4" /> },
    ...(canAccessExpenses ? [{ id: "expenses", icon: <ClipboardList className="h-4 w-4" /> }] : []),
    { id: "statistics", icon: <BarChart className="h-4 w-4" /> },
    { id: "documents", icon: <FileIcon className="h-4 w-4" /> }
  ];

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900",
      "border-b border-gray-200 dark:border-gray-800",
      "shadow-sm ios-top-safe"
    )}>
      <div className="flex items-center px-3 py-2 justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 px-1" 
            onClick={handleGoBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm font-medium">Détail du véhicule</div>
        </div>
        
        {/* Indicateurs de section */}
        <div className="flex space-x-3 items-center">
          {sections.map(section => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              className={cn(
                "p-1 h-8 w-8",
                activeSection === section.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-500 dark:text-gray-400"
              )}
              onClick={() => onSectionChange(section.id)}
            >
              {section.icon}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Indicateurs de swipe */}
      <div className="flex justify-center pb-1">
        <div className="flex space-x-1">
          {sections.map(section => (
            <div
              key={section.id}
              className={cn(
                "h-1 rounded-full transition-all",
                activeSection === section.id 
                  ? "bg-primary w-5" 
                  : "bg-gray-300 dark:bg-gray-700 w-3"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
