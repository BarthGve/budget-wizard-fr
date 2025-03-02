
import { useState, useEffect } from "react";
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
  showProjects: boolean;
}

export const SavingsProjectList = ({ projects, onProjectDeleted, showProjects }: SavingsProjectListProps) => {
  const [projectToDelete, setProjectToDelete] = useState<SavingsProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<SavingsProject | null>(null);
  const { toast } = useToast();
  
  // Set up real-time listener for monthly_savings changes affecting projects
  useEffect(() => {
    // Génération d'un identifiant unique pour le canal
    const channelId = `savings-project-changes-${Date.now()}`;
    console.log(`Creating real-time channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'monthly_savings',
          filter: 'is_project_saving=eq.true'
        },
        (payload) => {
          console.log('Project-related monthly saving changed:', payload);
          // Forcer la mise à jour de la liste des projets
          onProjectDeleted();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelId}:`, status);
      });
      
    return () => {
      console.log(`Removing channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [onProjectDeleted]);

  // Also listen for direct projets_epargne changes
  useEffect(() => {
    // Génération d'un identifiant unique pour le canal
    const channelId = `projects-changes-${Date.now()}`;
    console.log(`Creating projects table channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'projets_epargne'
        },
        (payload) => {
          console.log('Projects table changed:', payload);
          // Forcer la mise à jour de la liste des projets
          onProjectDeleted();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelId}:`, status);
      });
      
    return () => {
      console.log(`Removing channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [onProjectDeleted]);

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      // Delete the project from the database
      const { error: projectError } = await supabase
        .from('projets_epargne')
        .delete()
        .eq('id', projectToDelete.id);

      if (projectError) throw projectError;

      toast({
        title: "Projet supprimé",
        description: projectToDelete.added_to_recurring 
          ? "Le projet d'épargne et ses versements mensuels ont été supprimés avec succès" 
          : "Le projet d'épargne a été supprimé avec succès"
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

  // Configuration des variants pour les animations des cartes
  const containerVariants = {
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    },
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        when: "afterChildren"
      }
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
      <motion.div 
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-fr overflow-hidden mb-2"
        variants={containerVariants}
        initial="hidden"
        animate={showProjects ? "visible" : "hidden"}
      >
        <AnimatePresence>
          {projects.map((project, index) => (
            <SavingsProjectCard
              key={project.id}
              project={project}
              onDelete={setProjectToDelete}
              onSelect={setSelectedProject}
              index={index}
              isVisible={showProjects}
            />
          ))}
        </AnimatePresence>
        {showProjects && projects.length === 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full text-center text-muted-foreground py-10"
          >
            Aucun projet d'épargne enregistré
          </motion.p>
        )}
      </motion.div>

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
