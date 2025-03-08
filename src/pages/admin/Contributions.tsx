
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContributionsHeader } from "@/components/admin/contributions/ContributionsHeader";
import { ContributionsTable } from "@/components/admin/contributions/ContributionsTable";
import { ContributionDetailDialog } from "@/components/admin/contributions/ContributionDetailDialog";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";
import { ContributionStatus } from "@/components/admin/contributions/types";

const Contributions = () => {
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const queryClient = useQueryClient();

  // Récupération des contributions
  const { data: contributions = [], isLoading } = useQuery({
    queryKey: ["admin-contributions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributions")
        .select(`
          id, 
          title, 
          content, 
          type, 
          status, 
          created_at,
          profiles(id, full_name, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Mutation pour mettre à jour le statut
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContributionStatus }) => {
      const { error } = await supabase
        .from("contributions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contributions"] });
      toast.success("Statut mis à jour avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  // Gestionnaire pour changer le statut depuis la boîte de dialogue détaillée
  const handleStatusChange = (id: string, newStatus: ContributionStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
    
    // Mettre à jour également la contribution sélectionnée pour l'UI
    if (selectedContribution && selectedContribution.id === id) {
      setSelectedContribution({
        ...selectedContribution,
        status: newStatus
      });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="container py-6 space-y-6">
        <ContributionsHeader />
        
        <ContributionsTable />

        {selectedContribution && (
          <ContributionDetailDialog
            open={!!selectedContribution}
            onOpenChange={(open) => !open && setSelectedContribution(null)}
            contribution={selectedContribution}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Contributions;
