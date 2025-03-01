
import { FeedbackSearch } from "@/components/admin/FeedbackSearch";
import { FeedbackViewToggle } from "@/components/admin/FeedbackViewToggle";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { StatusFilter } from "@/hooks/useFeedbacks";

interface FeedbackHeaderProps {
  view: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}

export const FeedbackHeader = ({
  view,
  onViewChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FeedbackHeaderProps) => {
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des feedbacks</CardTitle>
          <FeedbackViewToggle 
            view={view}
            onViewChange={onViewChange}
          />
        </div>
      </CardHeader>
      <FeedbackSearch
        search={search}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
    </>
  );
};
