
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbacksTable } from "@/components/admin/FeedbacksTable";
import { FeedbacksKanban } from "@/components/admin/FeedbacksKanban";
import { Feedback } from "@/types/feedback";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 15;

export const AdminFeedbacks = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["feedbacks", page, statusFilter, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from("feedbacks")
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `, { count: "exact" });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      query = query
        .order(sortColumn, { ascending: sortDirection === "asc" })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        items: data as Feedback[],
        totalCount: count || 0,
      };
    },
  });

  const filteredFeedbacks = feedbacks?.items.filter(
    (feedback) =>
      feedback.title.toLowerCase().includes(search.toLowerCase()) ||
      feedback.content.toLowerCase().includes(search.toLowerCase()) ||
      feedback.profile.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((feedbacks?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("feedbacks")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const feedbackId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await handleUpdateStatus(feedbackId, newStatus);
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedbacks</h1>
          <p className="text-muted-foreground">
            Gérez les retours des utilisateurs
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des feedbacks</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView("table")}
                >
                  <Table2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "kanban" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView("kanban")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-4">
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {view === "table" ? (
              <FeedbacksTable
                feedbacks={filteredFeedbacks || []}
                onViewDetails={setSelectedFeedback}
              />
            ) : (
              <FeedbacksKanban
                feedbacks={filteredFeedbacks || []}
                onDragEnd={handleDragEnd}
              />
            )}

            <div className="mt-4 flex items-center justify-center">
              <Pagination>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span className="mx-4">
                  Page {page} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedFeedback && (
                <>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedFeedback.profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {selectedFeedback.profile.full_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedFeedback.profile.full_name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(selectedFeedback.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Titre</h3>
                    <p>{selectedFeedback.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Contenu</h3>
                    <p>{selectedFeedback.content}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Note</h3>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < selectedFeedback.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbacks;
