import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SavingsProject } from "@/types/savings-project";
import { SavingsProjectCard } from "./project-card/SavingsProjectCard";
import { SavingsProjectDetails } from "./project-details/SavingsProjectDetails";
import { DeleteProjectDialog } from "./project-delete/DeleteProjectDialog";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface SavingsProjectListProps {
  projects: SavingsProject[];
  onProjectDeleted: () => void;
  showProjects: boolean;
}

export const SavingsProjectList = ({ projects, onProjectDeleted, showProjects }: SavingsProjectListProps) => {
  const [projectToDelete, setProjectToDelete] = useState<SavingsProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<SavingsProject | null>(null);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
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
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <motion.div 
        className={cn(
          "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr overflow-hidden",
          showProjects ? "mb-4" : "mb-0"
        )}
        variants={containerVariants}
        initial="hidden"
        animate={showProjects ? "visible" : "hidden"}
      >
        <AnimatePresence mode="wait">
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full"
          >
            <div className={cn(
              "rounded-lg py-10 px-6 text-center",
              // Light mode
              "bg-gradient-to-b from-gray-50 to-gray-100/80 border border-gray-200/70",
              // Dark mode
              "dark:bg-gradient-to-b dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 8px -2px rgba(0, 0, 0, 0.15)"
                : "0 2px 8px -2px rgba(0, 0, 0, 0.05)"
            }}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={cn(
                  "p-3 rounded-full",
                  // Light mode
                  "bg-gradient-to-br from-teal-100 to-teal-50",
                  // Dark mode
                  "dark:bg-gradient-to-br dark:from-teal-900/40 dark:to-teal-800/30"
                )}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={cn(
                      "h-6 w-6",
                      "text-teal-600",
                      "dark:text-teal-400"
                    )}
                  >
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  </svg>
                </div>
                <h3 className={cn(
                  "text-lg font-medium bg-clip-text text-transparent",
                  // Light mode gradient
                  "bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500",
                  // Dark mode gradient
                  "dark:bg-gradient-to-r dark:from-teal-400 dark:via-teal-300 dark:to-emerald-400"
                )}>
                  Aucun projet d'épargne
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Vous n'avez pas encore créé de projets d'épargne. Commencez par définir vos objectifs.
                </p>
              </div>
            </div>
          </motion.div>
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
