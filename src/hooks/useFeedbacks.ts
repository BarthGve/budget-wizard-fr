
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "@/types/feedback";
import { toast } from "sonner";

export type StatusFilter = "pending" | "read" | "published" | "all";

const ITEMS_PER_PAGE = 15;

export const useFeedbacks = () => {
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

  const updateStatus = async (id: string, newStatus: "pending" | "read" | "published") => {
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

  const deleteFeedback = async (id: string) => {
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

  const approveFeedback = async (id: string) => {
    await updateStatus(id, "published");
  };

  const unapproveFeedback = async (id: string) => {
    await updateStatus(id, "read");
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const feedbackId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await updateStatus(feedbackId, newStatus as "pending" | "read" | "published");
  };

  return {
    page,
    setPage,
    view,
    setView,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedFeedback,
    setSelectedFeedback,
    filteredFeedbacks,
    totalPages,
    isLoading,
    handleStatusUpdate,
    deleteFeedback,
    approveFeedback,
    unapproveFeedback,
    handleDragEnd,
    refetch // Add refetch to the returned object
  };
};
