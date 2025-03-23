
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVehicleExpenseTable } from "./useVehicleExpenseTable";

interface VehicleExpenseTableFiltersProps {
  expenseTable: ReturnType<typeof useVehicleExpenseTable>;
  className?: string;
}

export const VehicleExpenseTableFilters = ({ 
  expenseTable,
  className 
}: VehicleExpenseTableFiltersProps) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    typeFilter, 
    setTypeFilter,
    uniqueExpenseTypes,
    allExpenseTypes,
    itemsPerPage,
    handleItemsPerPageChange
  } = expenseTable;

  // Fonction pour obtenir le label du type de dépense
  const getExpenseTypeLabel = (type: string): string => {
    if (type === allExpenseTypes) return "Tous les types";
    
    const typeLabels: Record<string, string> = {
      carburant: "Carburant",
      entretien: "Entretien",
      assurance: "Assurance",
      amende: "Amende",
      parking: "Parking",
      peage: "Péage",
      autres: "Autres"
    };
    
    return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full sm:w-[180px] h-9"
        />
      </div>
      
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className={cn("w-[160px]", className)}>
          <SelectValue placeholder="Type de dépense" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allExpenseTypes}>Tous les types</SelectItem>
          {uniqueExpenseTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {getExpenseTypeLabel(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={String(itemsPerPage)} onValueChange={(value) => handleItemsPerPageChange(Number(value))}>
        <SelectTrigger className={cn("w-[140px]", className)}>
          <SelectValue placeholder="Lignes par page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 par page</SelectItem>
          <SelectItem value="25">25 par page</SelectItem>
          <SelectItem value="-1">Tout afficher</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
