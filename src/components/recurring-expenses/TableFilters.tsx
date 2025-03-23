
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

interface TableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  uniqueCategories: string[];
}

export const TableFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  uniqueCategories
}: TableFiltersProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={cn(
      "flex space-x-2",
      isMobile ? "flex-col space-x-0 space-y-2 w-full" : "items-center"
    )}>
      <div className={cn(
        "relative",
        isMobile && "w-full"
      )}>
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-8 w-[200px] h-9",
            "bg-gray-50 border-gray-200",
            "dark:bg-gray-800 dark:border-gray-700",
            isMobile && "w-full"
          )}
        />
      </div>
      
      <Select 
        value={categoryFilter} 
        onValueChange={onCategoryFilterChange}
      >
        <SelectTrigger 
          className={cn(
            "w-[180px] h-9",
            "bg-gray-50 border-gray-200",
            "dark:bg-gray-800 dark:border-gray-700",
            isMobile && "w-full"
          )}
        >
          <SelectValue placeholder="Toutes les catégories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les catégories</SelectItem>
          {uniqueCategories.map(category => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
