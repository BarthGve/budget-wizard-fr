
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SavingsProject } from "@/types/savings-project";
import { SavingsProjectCard } from "./project-card/SavingsProjectCard";
import { SavingsProjectDetails } from "./project-details/SavingsProjectDetails";
import { DeleteProjectDialog } from "./project-delete/DeleteProjectDialog";

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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-6">
        {projects.map((project) => (
          <SavingsProjectCard
            key={project.id}
            project={project}
            onDelete={setProjectToDelete}
            onSelect={setSelectedProject}
          />
        ))}
        {projects.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Aucun projet d'épargne enregistré
          </p>
        )}
      </div>

      <DeleteProjectDialog
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDelete}
      />

      <SavingsProjectDetails
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
