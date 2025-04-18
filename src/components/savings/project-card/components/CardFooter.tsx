
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SavingsProject } from "@/types/savings-project";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CardFooterProps {
  onSelect: (project: SavingsProject) => void;
  project: SavingsProject;
}

export const CardFooter = ({ onSelect, project }: CardFooterProps) => {
  const handleActivateProject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const now = new Date();
      // Calculer la date estimée en fonction du mode de planification
      let estimatedDate: Date;
      
      if (project.mode_planification === 'par_mensualite' && project.montant_mensuel) {
        estimatedDate = new Date();
        estimatedDate.setMonth(estimatedDate.getMonth() + Math.ceil(project.montant_total / project.montant_mensuel));
      } else if (project.target_date) {
        // Si target_date est une chaîne, la convertir en Date
        estimatedDate = typeof project.target_date === 'string' 
          ? new Date(project.target_date) 
          : project.target_date;
      } else {
        // Date par défaut si aucune date n'est spécifiée
        estimatedDate = new Date();
        estimatedDate.setMonth(estimatedDate.getMonth() + 12); // Par défaut: 1 an
      }

      // Mettre à jour le projet
      const { error: projectError } = await supabase
        .from('projets_epargne')
        .update({
          statut: 'actif',
          created_at: new Date().toISOString(),
          date_estimee: estimatedDate.toISOString(),
          added_to_recurring: true,
        })
        .eq('id', project.id);

      if (projectError) throw projectError;

      // Créer l'épargne mensuelle associée
      const { error: savingError } = await supabase
        .from('monthly_savings')
        .insert({
          name: project.nom_projet,
          amount: project.montant_mensuel,
          description: `Épargne mensuelle pour le projet: ${project.nom_projet}`,
          profile_id: project.profile_id,
          projet_id: project.id,
          is_project_saving: true,
          logo_url: project.image_url
        });

      if (savingError) throw savingError;

      toast.success("Le projet a été activé avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'activation du projet:', error);
      toast.error("Erreur lors de l'activation du projet");
    }
  };

  return (
    <motion.div 
      className="mt-auto"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      {project.statut === 'en_attente' ? (
        <Button
          onClick={handleActivateProject}
          className={cn(
            "w-full py-2 px-3 rounded-md flex items-center justify-between text-sm font-medium transition-colors",
            "bg-quaternary-50 hover:bg-quaternary-100 text-quaternary-700 border border-quaternary-200",
            "dark:bg-quaternary-900/20 dark:hover:bg-quaternary-900/30 dark:text-quaternary-300 dark:border-quaternary-800/30"
          )}
        >
          <span>Activer le projet</span>
          <PlayCircle className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          onClick={() => onSelect(project)}
          className={cn(
            "w-full py-2 px-3 rounded-md flex items-center justify-between text-sm font-medium transition-colors",
            "bg-quaternary-50 hover:bg-quaternary-100 text-quaternary-700 border border-quaternary-200",
            "dark:bg-quaternary-900/20 dark:hover:bg-quaternary-900/30 dark:text-quaternary-300 dark:border-quaternary-800/30"
          )}
        >
          <span>Voir les détails</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </motion.div>
  );
};
