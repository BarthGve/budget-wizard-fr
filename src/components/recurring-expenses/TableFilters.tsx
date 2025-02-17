
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CATEGORIES, ALL_PERIODICITIES, periodicityLabels } from "./types";

interface TableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  periodicityFilter: string;
  onPeriodicityFilterChange: (value: string) => void;
  uniqueCategories: string[];
}

export const TableFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  periodicityFilter,
  onPeriodicityFilterChange,
  uniqueCategories,
}: TableFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 w-[250px]"
        />
      </div>
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-[220px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES}>Toutes les catégories</SelectItem>
          {uniqueCategories.map((category) => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={periodicityFilter} onValueChange={onPeriodicityFilterChange}>
        <SelectTrigger className="w-[220px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Périodicité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_PERIODICITIES}>Toutes les périodicités</SelectItem>
          {Object.entries(periodicityLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
