
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleExpenseTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const VehicleExpenseTablePagination = ({
  currentPage,
  totalPages,
  onPageChange
}: VehicleExpenseTablePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "hover:bg-gray-50 dark:hover:bg-gray-900/10",
          "border-gray-200 dark:border-gray-800"
        )}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>
      
      <div className="flex items-center">
        <span className={cn(
          "text-sm mx-2",
          "text-gray-700 dark:text-gray-300"
        )}>
          Page {currentPage} sur {totalPages}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "hover:bg-gray-50 dark:hover:bg-gray-900/10",
          "border-gray-200 dark:border-gray-800"
        )}
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
