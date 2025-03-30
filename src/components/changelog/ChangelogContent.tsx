
import { ChangelogTimeline } from "./ChangelogTimeline";
import { ChangelogEntry } from "./types";

interface ChangelogContentProps {
  entries: ChangelogEntry[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (entry: ChangelogEntry) => void;
  onDelete: (entryId: string) => void;
}

export const ChangelogContent = ({ 
  entries, 
  isLoading, 
  isAdmin,
  onEdit,
  onDelete 
}: ChangelogContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ChangelogTimeline 
      entries={entries} 
      isAdmin={isAdmin} 
      onEdit={onEdit} 
      onDelete={onDelete} 
    />
  );
};
