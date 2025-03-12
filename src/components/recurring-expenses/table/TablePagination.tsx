
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  colorScheme?: "blue" | "purple" | "green" | "amber";
}

export const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  colorScheme = "blue" 
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;
  
  // Couleurs selon le schéma choisi
  const colors = {
    blue: {
      activeText: "text-blue-700 dark:text-blue-300",
      activeBg: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/10",
    },
    purple: {
      activeText: "text-purple-700 dark:text-purple-300",
      activeBg: "border-purple-500 bg-purple-50 dark:bg-purple-900/20",
      hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-900/10",
    },
    green: {
      activeText: "text-green-700 dark:text-green-300",
      activeBg: "border-green-500 bg-green-50 dark:bg-green-900/20",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/10",
    },
    amber: {
      activeText: "text-amber-700 dark:text-amber-300",
      activeBg: "border-amber-500 bg-amber-50 dark:bg-amber-900/20",
      hoverBg: "hover:bg-amber-50 dark:hover:bg-amber-900/10",
    }
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
