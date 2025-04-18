
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Navbar from "@/components/layout/Navbar";
import { ChangelogHeader } from "./ChangelogHeader";
import { ChangelogFilters } from "./ChangelogFilters";
import { ChangelogContent } from "./ChangelogContent";
import { ChangelogEntryDialog } from "./ChangelogEntryDialog";
import { ChangelogDeleteDialog } from "./ChangelogDeleteDialog";
import { ChangelogEntry } from "./types";
import { fetchChangelogEntries } from "@/services/changelog";

interface ChangelogPageProps {
  isAdmin?: boolean;
}

export const ChangelogPage = ({ isAdmin = false }: ChangelogPageProps) => {
  const { isAdmin: userIsAdmin } = usePagePermissions();
  const isAdminView = isAdmin || userIsAdmin;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  // Initialiser showHidden à true si l'utilisateur est admin
  const [showHidden, setShowHidden] = useState(isAdminView);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ChangelogEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Récupérer toutes les entrées pour les administrateurs
  const { data: allEntries = [], isLoading } = useQuery({
    queryKey: ["changelog", isAdminView, showHidden],
    queryFn: () => fetchChangelogEntries(isAdminView && showHidden),
  });

  useEffect(() => {
    const channel = supabase
      .channel("changelog-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "changelog_entries",
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["changelog"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filteredEntries = allEntries.filter((entry) => {
    const matchesSearch = search.toLowerCase() === "" 
      ? true 
      : entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEdit = (entry: ChangelogEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entryId: string) => {
    setEntryToDelete(entryId);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

  // Calcul des entrées cachées pour l'affichage admin
  const hiddenEntriesCount = isAdminView 
    ? allEntries.filter(entry => !entry.is_visible).length
    : 0;

  const toggleShowHidden = () => {
    setShowHidden(prev => !prev);
  };

  const content = (
    <div className={`${isAdminView ? "" : "min-h-screen bg-gradient-to-br from-primary/5 via-background to-background"}`}>
      {!isAdminView && <Navbar />}
      <div className={`container mx-auto px-4 py-8 ${!isAdminView ? "pt-32" : ""}`}>
        <ChangelogHeader 
          isAdmin={isAdminView} 
          onCreateNew={handleCreate}
          hiddenCount={hiddenEntriesCount}
          showHidden={showHidden}
          onToggleShowHidden={toggleShowHidden} 
        />
        
        <ChangelogFilters 
          search={search} 
          onSearchChange={setSearch} 
          typeFilter={typeFilter} 
          onTypeFilterChange={setTypeFilter} 
        />

        <ChangelogContent 
          entries={filteredEntries} 
          isLoading={isLoading} 
          isAdmin={isAdminView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ChangelogEntryDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          entry={selectedEntry}
        />

        <ChangelogDeleteDialog 
          isOpen={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen} 
          entryId={entryToDelete}
        />
      </div>
    </div>
  );

  if (isAdminView && !isAdmin) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return content;
};
