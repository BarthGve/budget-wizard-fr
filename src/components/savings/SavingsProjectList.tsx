
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsProject } from "@/types/savings-project";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SavingsProjectListProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
}

export const SavingsProjectList = ({ projects, onProjectDeleted }: SavingsProjectListProps) => {
  const [projectToDelete, setProjectToDelete] = useState<SavingsProject | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      // Si le projet a été converti en versement mensuel, on le supprime aussi
      if (projectToDelete.added_to_recurring) {
        const { error: monthlySavingError } = await supabase
          .from('monthly_savings')
          .delete()
          .eq('name', projectToDelete.nom_projet);

        if (monthlySavingError) throw monthlySavingError;
      }

      // Suppression du projet
      const { error: projectError } = await supabase
        .from('projets_epargne')
        .delete()
        .eq('id', projectToDelete.id);

      if (projectError) throw projectError;

      toast({
        title: "Projet supprimé",
        description: "Le projet d'épargne a été supprimé avec succès"
      });

      onProjectDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet",
        variant: "destructive"
      });
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <CardTitle className="py-4">Projets d'épargne</CardTitle>
      <div className="grid gap-4 grid-cols-8">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <div className="aspect-video relative">
              <img
                src={project.image_url || "/placeholder.svg"}
                alt={project.nom_projet}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">{project.nom_projet}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => setProjectToDelete(project)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-sm font-medium">Objectif:</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(project.montant_total)}
                  </p>
                </div>
                <Badge variant={project.added_to_recurring ? "default" : "outline"} className="flex-shrink-0">
                  {project.added_to_recurring ? "Actif" : "En attente"}
                </Badge>
              </div>
              {project.montant_mensuel && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {formatCurrency(project.montant_mensuel)} / mois
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Aucun projet d'épargne enregistré
          </p>
        )}
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le projet
              {projectToDelete?.added_to_recurring && " et son versement mensuel associé"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
