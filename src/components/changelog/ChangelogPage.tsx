
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { motion } from "framer-motion";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export const ChangelogPage = () => {
  const { isAdmin } = usePagePermissions();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ChangelogEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const queryClient = useQueryClient();

  const { data: allEntries = [], isLoading } = useQuery({
    queryKey: ["changelog"],
    queryFn: fetchChangelogEntries,
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
  
  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

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
  
  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const content = (
    <div className={`${isAdmin ? "" : "min-h-screen bg-gradient-to-br from-primary/5 via-background to-background"}`}>
      {!isAdmin && <Navbar />}
      <div className={`container mx-auto px-4 py-8 ${!isAdmin ? "pt-32" : ""}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <ChangelogHeader isAdmin={isAdmin} onCreateNew={handleCreate} />
          
          <ChangelogFilters 
            search={search} 
            onSearchChange={setSearch} 
            typeFilter={typeFilter} 
            onTypeFilterChange={setTypeFilter} 
          />
  
          <ChangelogContent 
            entries={currentEntries} 
            isLoading={isLoading} 
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          {filteredEntries.length > entriesPerPage && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                  )}
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    
                    // Show only immediate pages around current page
                    if (
                      page === 1 || 
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={isCurrentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <PaginationItem key={page}>...</PaginationItem>;
                    }
                    return null;
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.div>

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

  if (isAdmin) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return content;
};
