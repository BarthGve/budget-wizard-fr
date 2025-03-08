
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ContributionDetailDialog } from "./ContributionDetailDialog";
import { Contribution, ContributionStatus } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";

export const ContributionsTable = () => {
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contributions = [], isLoading } = useQuery({
    queryKey: ["contributions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributions")
        .select(`
          *,
          profiles:profile_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Contribution[];
    },
  });

  const updateContributionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContributionStatus }) => {
      const { error } = await supabase
        .from("contributions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.success("Statut mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const deleteContribution = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contributions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.success("Contribution supprimée avec succès");
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la contribution");
    },
  });

  const handleStatusChange = (id: string, status: ContributionStatus) => {
    updateContributionStatus.mutate({ id, status });
  };

  const handleDetailClick = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedContribution) {
      deleteContribution.mutate(selectedContribution.id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement des contributions...</div>;
  }

  return (
    <TooltipProvider>
      <div>
        {contributions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Aucune contribution n'a été soumise pour le moment.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((contribution) => (
                  <TableRow key={contribution.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleDetailClick(contribution)}>
                    <TableCell className="font-medium">{contribution.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {contribution.type === "feature" 
                          ? "Fonctionnalité" 
                          : contribution.type === "bug" 
                            ? "Bug" 
                            : contribution.type === "improvement" 
                              ? "Amélioration" 
                              : contribution.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{contribution.profiles?.full_name || "Utilisateur"}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(contribution.created_at), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contribution.status === "completed"
                            ? "default"
                            : contribution.status === "in_progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {contribution.status === "completed"
                          ? "Traité"
                          : contribution.status === "in_progress"
                          ? "En cours"
                          : "À traiter"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(contribution);
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedContribution && (
          <ContributionDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            contribution={selectedContribution}
            onStatusChange={handleStatusChange}
          />
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement la contribution "{selectedContribution?.title}".
                Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};
