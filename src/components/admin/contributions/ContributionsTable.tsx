
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { MoreVertical, Trash } from "lucide-react";
import { ContributionStatus } from "./types";

// Objet pour mapper les status aux badges
const statusBadges = {
  pending: { label: "À traiter", variant: "outline" as const },
  in_progress: { label: "En cours", variant: "secondary" as const },
  completed: { label: "Traité", variant: "default" as const }
};

// Objet pour mapper les types aux libellés
const typeLabels: Record<string, string> = {
  feature: "Nouvelle fonctionnalité",
  improvement: "Amélioration",
  bugfix: "Correction de bug",
  design: "Design/UI",
  performance: "Performance",
  other: "Autre"
};

export const ContributionsTable = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
      setDeleteId(null); // Fermer la boîte de dialogue
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  });

  // Gestionnaire pour changer le statut
  const handleStatusChange = (id: string, newStatus: ContributionStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  // Gestionnaire pour la confirmation de suppression
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  // Gestionnaire pour confirmer la suppression
  const confirmDelete = () => {
    if (deleteId) {
      deleteContributionMutation.mutate(deleteId);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Chargement des contributions...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune contribution pour le moment
                </TableCell>
              </TableRow>
            ) : (
              contributions.map((contribution: any) => (
                <TableRow key={contribution.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contribution.profiles?.avatar_url} alt={contribution.profiles?.full_name || 'Utilisateur'} />
                        <AvatarFallback>{getInitials(contribution.profiles?.full_name || 'Utilisateur')}</AvatarFallback>
                      </Avatar>
                      <span>{contribution.profiles?.full_name || 'Utilisateur'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{typeLabels[contribution.type] || contribution.type}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={contribution.title}>
                    {contribution.title}
                  </TableCell>
                  <TableCell>
                    {format(new Date(contribution.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadges[contribution.status as ContributionStatus].variant}>
                      {statusBadges[contribution.status as ContributionStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onSelect={() => handleStatusChange(contribution.id, "pending")}
                          disabled={contribution.status === "pending"}
                        >
                          Marquer comme "À traiter"
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => handleStatusChange(contribution.id, "in_progress")}
                          disabled={contribution.status === "in_progress"}
                        >
                          Marquer comme "En cours"
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => handleStatusChange(contribution.id, "completed")}
                          disabled={contribution.status === "completed"}
                        >
                          Marquer comme "Traité"
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onSelect={() => handleDelete(contribution.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette contribution ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La contribution sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
