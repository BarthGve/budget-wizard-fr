
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ContributionDetailDialog } from "./ContributionDetailDialog";
import { Contribution, ContributionStatus } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export const ContributionsTable = () => {
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
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
          updated_at,
          profiles(id, full_name, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Contribution[];
    }
  });

  // Mutation pour supprimer une contribution
  const deleteContributionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contributions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contributions"] });
      toast.success("Contribution supprimée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
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

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette contribution ?")) {
      deleteContributionMutation.mutate(id);
    }
  };

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

  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status: ContributionStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">À traiter</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Traité</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Format du type de contribution
  const formatType = (type: string) => {
    const types: Record<string, string> = {
      "feature": "Nouvelle fonctionnalité",
      "improvement": "Amélioration",
      "bug": "Bug",
      "idea": "Idée",
      "other": "Autre"
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune contribution n'a été soumise pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              contributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-left hover:underline"
                      onClick={() => setSelectedContribution(contribution)}
                    >
                      {contribution.title}
                    </Button>
                  </TableCell>
                  <TableCell>{formatType(contribution.type)}</TableCell>
                  <TableCell>{contribution.profiles?.full_name || "Utilisateur inconnu"}</TableCell>
                  <TableCell>
                    {format(new Date(contribution.created_at), "d MMMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>{getStatusBadge(contribution.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedContribution(contribution)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(contribution.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedContribution && (
        <ContributionDetailDialog
          open={!!selectedContribution}
          onOpenChange={(open) => !open && setSelectedContribution(null)}
          contribution={selectedContribution}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};
