
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface TablePaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: Dispatch<SetStateAction<number>>;
}

export const TablePagination = ({ 
  currentPage, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange 
}: TablePaginationProps) => {
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1 && itemsPerPage !== -1) return null;
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
      <Select
        value={String(itemsPerPage)} 
        onValueChange={(value) => onItemsPerPageChange(Number(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Lignes par page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 lignes</SelectItem>
          <SelectItem value="25">25 lignes</SelectItem>
          <SelectItem value="50">50 lignes</SelectItem>
          <SelectItem value="-1">Toutes</SelectItem>
        </SelectContent>
      </Select>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
