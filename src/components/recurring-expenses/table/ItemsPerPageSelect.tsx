
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ItemsPerPageSelectProps {
  itemsPerPage: number;
  onChange: (value: number) => void;
  className?: string; // Ajout de la propriété className optionnelle
}

export const ItemsPerPageSelect = ({ itemsPerPage, onChange, className }: ItemsPerPageSelectProps) => {
  return (
    <Select value={String(itemsPerPage)} onValueChange={(value) => onChange(Number(value))}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Lignes par page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10 par page</SelectItem>
        <SelectItem value="25">25 par page</SelectItem>
        <SelectItem value="-1">Tout afficher</SelectItem>
      </SelectContent>
    </Select>
  );
};
