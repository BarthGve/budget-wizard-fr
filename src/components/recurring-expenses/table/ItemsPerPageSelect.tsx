
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ItemsPerPageSelectProps {
  itemsPerPage: number;
  onChange: (value: number) => void;
}

export const ItemsPerPageSelect = ({ itemsPerPage, onChange }: ItemsPerPageSelectProps) => {
  return (
    <Select value={String(itemsPerPage)} onValueChange={(value) => onChange(Number(value))}>
      <SelectTrigger className="w-[180px]">
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
