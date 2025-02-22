
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsProject } from "@/types/savings-project";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays } from "date-fns";

interface SavingsProjectListProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
}

export const SavingsProjectList = ({ projects, onProjectDeleted }: SavingsProjectListProps) => {
  const [projectToDelete, setProjectToDelete] = useState<SavingsProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<SavingsProject | null>(null);
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

  const calculateSavedAmount = (project: SavingsProject) => {
    if (!project.montant_mensuel || !project.created_at) return 0;
    
    const daysSinceCreation = differenceInDays(new Date(), new Date(project.created_at));
    const monthsSinceCreation = Math.floor(daysSinceCreation / 30);
    return project.montant_mensuel * monthsSinceCreation;
  };

  const calculateProgress = (project: SavingsProject) => {
    const savedAmount = calculateSavedAmount(project);
    return Math.min((savedAmount / project.montant_total) * 100, 100);
  };

  const getBadgeVariant = (project: SavingsProject) => {
    if (project.statut === 'dépassé') return "destructive";
    if (project.added_to_recurring) return "default";
    return "outline";
  };

  const getBadgeText = (project: SavingsProject) => {
    if (project.statut === 'dépassé') return "Dépassé";
    if (project.added_to_recurring) return "Actif";
    return "En attente";
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <div 
              className="aspect-video relative cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
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
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Progression:</p>
                  <Progress value={calculateProgress(project)} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Objectif:</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(project.montant_total)}
                    </p>
                  </div>
                  <Badge variant={getBadgeVariant(project)} className="flex-shrink-0">
                    {getBadgeText(project)}
                  </Badge>
                </div>
              </div>
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

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProject?.nom_projet}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="aspect-video relative">
                <img
                  src={selectedProject.image_url || "/placeholder.svg"}
                  alt={selectedProject.nom_projet}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {selectedProject.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Objectif</h3>
                  <p className="text-2xl font-bold">{formatCurrency(selectedProject.montant_total)}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Déjà épargné</h3>
                  <p className="text-2xl font-bold">{formatCurrency(calculateSavedAmount(selectedProject))}</p>
                </div>

                {selectedProject.montant_mensuel && (
                  <div>
                    <h3 className="font-semibold mb-2">Versement mensuel</h3>
                    <p>{formatCurrency(selectedProject.montant_mensuel)} / mois</p>
                  </div>
                )}

                {selectedProject.date_estimee && (
                  <div>
                    <h3 className="font-semibold mb-2">Date d'objectif estimée</h3>
                    <p>{new Date(selectedProject.date_estimee).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long'
                    })}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Progression</h3>
                <Progress value={calculateProgress(selectedProject)} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(calculateProgress(selectedProject))}% de l'objectif atteint
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
