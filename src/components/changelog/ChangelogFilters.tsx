
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
  const filterCount = (typeFilter !== 'all' ? 1 : 0) + (search.trim() !== '' ? 1 : 0);
  
  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-4 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans les mises à jour..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-12 bg-background/70 backdrop-blur-sm border-muted"
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full md:w-[220px] h-12 bg-background/70 backdrop-blur-sm border-muted">
          <div className="flex items-center justify-between w-full">
            <SelectValue placeholder="Type de mise à jour" />
            {filterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filterCount}
              </Badge>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les mises à jour</SelectItem>
          <SelectItem value="new">Nouveautés</SelectItem>
          <SelectItem value="improvement">Améliorations</SelectItem>
          <SelectItem value="bugfix">Corrections</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};
