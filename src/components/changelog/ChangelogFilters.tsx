
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChangelogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const ChangelogFilters = ({ 
  search, 
  onSearchChange, 
  typeFilter, 
  onTypeFilterChange 
}: ChangelogFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="new">Nouveau</SelectItem>
          <SelectItem value="improvement">Amélioration</SelectItem>
          <SelectItem value="bugfix">Correction</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
