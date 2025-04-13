
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  colorScheme?: "tertiary" | "purple" | "green" | "amber";
}

export const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  colorScheme = "tertiary" 
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;
  
  // Couleurs selon le schéma choisi
  const colors = {
    tertiary: {
      activeText: "text-tertiary-700 dark:text-tertiary-300",
      activeBg: "border-tertiary-500 bg-tertiary-50 dark:bg-tertiary-900/20",
      hoverBg: "hover:bg-tertiary-50 dark:hover:bg-tertiary-900/10",
    },
  };
  
  const currentColors = colors[colorScheme];
  
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(currentColors.hoverBg)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>
      
      <div className="flex items-center">
        <span className={cn("text-sm mx-2", currentColors.activeText)}>
          Page {currentPage} sur {totalPages}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(currentColors.hoverBg)}
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
