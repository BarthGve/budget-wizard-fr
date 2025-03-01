
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SavingsProject } from "@/types/savings-project";
import { SavingsProjectCard } from "./project-card/SavingsProjectCard";
import { SavingsProjectDetails } from "./project-details/SavingsProjectDetails";
import { DeleteProjectDialog } from "./project-delete/DeleteProjectDialog";
import { AnimatePresence, motion } from "framer-motion";

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
      if (projectToDelete.added_to_recurring) {
        const { error: monthlySavingError } = await supabase
          .from('monthly_savings')
          .delete()
          .eq('name', projectToDelete.nom_projet);

        if (monthlySavingError) throw monthlySavingError;

        // Mettre à jour le statut du projet en "en attente"
        const { error: updateError } = await supabase
          .from('projets_epargne')
          .update({ 
            added_to_recurring: false,
            statut: 'en_attente'
          })
          .eq('id', projectToDelete.id);

        if (updateError) throw updateError;
      }

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
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <AnimatePresence mode="wait">
          {projects.map((project, index) => (
            <SavingsProjectCard
              key={project.id}
              project={project}
              onDelete={setProjectToDelete}
              onSelect={setSelectedProject}
              index={index}
            />
          ))}
        </AnimatePresence>
        {projects.length === 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full text-center text-muted-foreground py-10"
          >
            Aucun projet d'épargne enregistré
          </motion.p>
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
    </motion.div>
  );
};
