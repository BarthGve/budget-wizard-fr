
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbacksTable } from "@/components/admin/FeedbacksTable";
import { FeedbacksKanban } from "@/components/admin/FeedbacksKanban";
import { Feedback } from "@/types/feedback";
import { toast } from "sonner";
import { FeedbackSearch } from "@/components/admin/FeedbackSearch";
import { FeedbackViewToggle } from "@/components/admin/FeedbackViewToggle";
import { FeedbackDetailsDialog } from "@/components/admin/FeedbackDetailsDialog";
import { FeedbackPagination } from "@/components/admin/FeedbackPagination";

const ITEMS_PER_PAGE = 15;

type StatusFilter = "pending" | "in_progress" | "completed" | "all";

export const AdminFeedbacks = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>([]);

  const { data: feedbacks, isLoading, refetch } = useQuery({
    queryKey: ["feedbacks", page, statusFilter, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from("feedbacks")
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `, { count: "exact" });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      query = query
        .order(sortColumn, { ascending: sortDirection === "asc" })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      setLocalFeedbacks(data as Feedback[]);

      return {
        items: data as Feedback[],
        totalCount: count || 0,
      };
    },
  });

  const handleStatusUpdate = (updatedFeedback: Feedback) => {
    setLocalFeedbacks(prevFeedbacks =>
      prevFeedbacks.map(feedback =>
        feedback.id === updatedFeedback.id ? updatedFeedback : feedback
      )
    );
  };

  const filteredFeedbacks = localFeedbacks.filter(
    (feedback) =>
      feedback.title.toLowerCase().includes(search.toLowerCase()) ||
      feedback.content.toLowerCase().includes(search.toLowerCase()) ||
      feedback.profile.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((feedbacks?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleUpdateStatus = async (id: string, newStatus: "pending" | "in_progress" | "completed") => {
    try {
      const { error } = await supabase
        .from("feedbacks")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      setLocalFeedbacks(prevFeedbacks =>
        prevFeedbacks.map(feedback =>
          feedback.id === id ? { ...feedback, status: newStatus } : feedback
        )
      );
      
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from("feedbacks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLocalFeedbacks(prevFeedbacks => 
        prevFeedbacks.filter(feedback => feedback.id !== id)
      );
      
      toast.success("Feedback supprimé avec succès");
      
      if (localFeedbacks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetch();
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Erreur lors de la suppression du feedback");
    }
  };

  const handleApproveFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from("feedbacks")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;
      
      setLocalFeedbacks(prevFeedbacks =>
        prevFeedbacks.map(feedback =>
          feedback.id === id ? { ...feedback, status: "completed" } : feedback
        )
      );
      
      toast.success("Feedback approuvé");
    } catch (error) {
      console.error("Error approving feedback:", error);
      toast.error("Erreur lors de l'approbation du feedback");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const feedbackId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await handleUpdateStatus(feedbackId, newStatus as "pending" | "in_progress" | "completed");
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
              <FeedbackViewToggle 
                view={view}
                onViewChange={setView}
              />
            </div>
          </CardHeader>
          <CardContent>
            <FeedbackSearch
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {view === "table" ? (
              <FeedbacksTable
                feedbacks={filteredFeedbacks}
                onViewDetails={setSelectedFeedback}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteFeedback}
                onApprove={handleApproveFeedback}
              />
            ) : (
              <FeedbacksKanban
                feedbacks={filteredFeedbacks}
                onDragEnd={handleDragEnd}
              />
            )}

            <FeedbackPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>

        <FeedbackDetailsDialog
          feedback={selectedFeedback}
          onOpenChange={() => setSelectedFeedback(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbacks;
