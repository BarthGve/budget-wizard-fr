
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangelogEntryForm } from "@/components/changelog/ChangelogEntryForm";
import { useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { deleteChangelogEntry, fetchChangelogEntries } from "@/services/changelog";
import { supabase } from "@/integrations/supabase/client";

const Changelog = () => {
  const { isAdmin } = usePagePermissions();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["changelog"],
    queryFn: fetchChangelogEntries,
  });

  const { mutate: deleteEntry } = useMutation({
    mutationFn: deleteChangelogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changelog"] });
      toast.success("Entrée supprimée avec succès");
    },
    onError: (error) => {
      console.error("Error deleting changelog entry:", error);
      toast.error("Une erreur est survenue");
    },
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

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = search.toLowerCase() === "" 
      ? true 
      : entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEdit = (entry: any) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?");
    if (!confirmed) return;
    deleteEntry(entryId);
  };

  const content = (
    <div className={`${isAdmin ? "" : "min-h-screen bg-gradient-to-br from-primary/5 via-background to-background"}`}>
      {!isAdmin && <Navbar />}
      <div className={`container mx-auto px-4 py-8 ${!isAdmin ? "pt-32" : ""}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl text-primary font-bold">Changelog</h1>
            <p className="text-muted-foreground mt-2">
              Suivez les dernières mises à jour et améliorations
            </p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => {
                setSelectedEntry(null);
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Nouvelle entrée
            </Button>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="improvement">Amélioration</SelectItem>
              <SelectItem value="bugfix">Correction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ChangelogTimeline 
            entries={filteredEntries} 
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEntry ? "Modifier l'entrée" : "Nouvelle entrée"}
              </DialogTitle>
            </DialogHeader>
            <ChangelogEntryForm
              initialData={selectedEntry}
              onSuccess={() => {
                setIsDialogOpen(false);
                setSelectedEntry(null);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setSelectedEntry(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  if (isAdmin) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return content;
};

export default Changelog;

