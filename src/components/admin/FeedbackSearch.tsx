import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type StatusFilter = "pending" | "read" | "published" | "all";
interface FeedbackSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}
export const FeedbackSearch = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: FeedbackSearchProps) => {
  return <div className="mb-6 flex gap-4">
      <Input placeholder="Rechercher..." value={search} onChange={e => onSearchChange(e.target.value)} className="max-w-sm" />
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="read">Lu</SelectItem>
          <SelectItem value="published">Publié</SelectItem>
        </SelectContent>
      </Select>
    </div>;
};