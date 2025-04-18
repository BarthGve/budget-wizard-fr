
import { ChangelogEntry } from "./types";
import { ChangelogLoader } from "./content/ChangelogLoader";
import { ChangelogEmptyState } from "./content/ChangelogEmptyState";
import { ChangelogEntryCard } from "./content/ChangelogEntry";
import { ChangelogPagination } from "./content/ChangelogPagination";

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
    return <ChangelogLoader />;
  }

  if (entries.length === 0) {
    return <ChangelogEmptyState />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {entries.map((entry) => (
          <ChangelogEntryCard
            key={entry.id}
            entry={entry}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {entries.length > 0 && <ChangelogPagination />}
    </div>
  );
};
