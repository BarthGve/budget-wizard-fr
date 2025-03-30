
import { ChangelogTimeline } from "./ChangelogTimeline";
import { ChangelogEntry } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6 items-start">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-10 text-center"
      >
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground h-8 w-8"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Aucune mise à jour trouvée</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          Aucune entrée ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
        </p>
      </motion.div>
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
