
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Contribution = {
  id: string;
  profile_id: string;
  type: string;
  title: string;
  content: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type StatusFilter = "pending" | "in_progress" | "completed" | "all";

const ITEMS_PER_PAGE = 15;

export const useContributions = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [localContributions, setLocalContributions] = useState<Contribution[]>([]);

  const { data: contributions, isLoading, refetch } = useQuery({
    queryKey: ["contributions", page, statusFilter, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from("contributions")
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

      setLocalContributions(data as Contribution[]);

      return {
        items: data as Contribution[],
        totalCount: count || 0,
      };
    },
  });

  const handleStatusUpdate = (updatedContribution: Contribution) => {
    setLocalContributions(prevContributions =>
      prevContributions.map(contribution =>
        contribution.id === updatedContribution.id ? updatedContribution : contribution
      )
    );
  };

  const filteredContributions = localContributions.filter(
    (contribution) =>
      contribution.title.toLowerCase().includes(search.toLowerCase()) ||
      contribution.content.toLowerCase().includes(search.toLowerCase()) ||
      contribution.profile.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((contributions?.totalCount || 0) / ITEMS_PER_PAGE);

  const updateStatus = async (id: string, newStatus: "pending" | "in_progress" | "completed") => {
    try {
      const { error } = await supabase
        .from("contributions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      setLocalContributions(prevContributions =>
        prevContributions.map(contribution =>
          contribution.id === id ? { ...contribution, status: newStatus } : contribution
        )
      );
      
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const deleteContribution = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contributions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLocalContributions(prevContributions => 
        prevContributions.filter(contribution => contribution.id !== id)
      );
      
      toast.success("Contribution supprimée avec succès");
      
      if (localContributions.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetch();
      }
    } catch (error) {
      console.error("Error deleting contribution:", error);
      toast.error("Erreur lors de la suppression de la contribution");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const contributionId = result.draggableId;
    const newStatus = result.destination.droppableId as "pending" | "in_progress" | "completed";

    await updateStatus(contributionId, newStatus);
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
    selectedContribution,
    setSelectedContribution,
    filteredContributions,
    totalPages,
    isLoading,
    handleStatusUpdate,
    deleteContribution,
    updateStatus,
    handleDragEnd,
    refetch
  };
};
