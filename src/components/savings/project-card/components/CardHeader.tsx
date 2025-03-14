
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp } from "lucide-react";
import { SavingsProject } from "@/types/savings-project";
import { cn } from "@/lib/utils";

interface CardHeaderProps {
  project: SavingsProject;
  onDelete: (project: SavingsProject) => void;
  onSelect: (project: SavingsProject) => void;
  progressPercentage: number;
  isComplete: boolean;
}

export const CardHeader = ({ 
  project, 
  onDelete, 
  onSelect,
  progressPercentage,
  isComplete
}: CardHeaderProps) => {
  // Fonction pour déterminer le variant du badge
  const getBadgeVariant = (): "default" | "destructive" | "secondary" | "outline" => {
    if (project.statut === 'dépassé' || progressPercentage >= 100) return "secondary";
    if (project.statut === 'actif') return "default";
    return "outline";
  };

  // Fonction pour déterminer le texte du badge
  const getBadgeText = () => {
    if (project.statut === 'dépassé' || progressPercentage >= 100) return "Objectif atteint";
    if (project.statut === 'actif') return "En cours";
    return "En attente";
  };

  return (
    <div 
      className="h-48 relative cursor-pointer overflow-hidden"
      onClick={() => onSelect(project)}
    >
      {/* Badge overlay for status */}
      <div className="absolute top-3 left-3 z-10">
        <Badge 
          variant={getBadgeVariant()} 
          className={cn(
            "font-medium shadow-sm",
            isComplete 
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white border-none"
              : "border-emerald-200 dark:border-emerald-800/50"
          )}
        >
          {isComplete && <TrendingUp className="h-3 w-3 mr-1" />}
          {getBadgeText()}
        </Badge>
      </div>
      
      {/* Delete button overlay with improved positioning */}
      <motion.div 
        className="absolute top-3 right-3 z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="destructive"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full shadow-md",
            "bg-red-100/80 hover:bg-red-200 text-red-600 border-red-200",
            "dark:bg-red-900/50 dark:hover:bg-red-900/80 dark:text-red-400 dark:border-red-800/50"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </motion.div>

      {/* Fond de dégradé amélioré pour une meilleure lisibilité du titre */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/10 opacity-80 z-0"></div>
      
      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
        src={project.image_url || "/placeholder.svg"}
        alt={project.nom_projet}
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
      
      {/* Conteneur du titre avec une meilleure lisibilité */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="font-bold text-white text-lg leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
          {project.nom_projet}
        </h3>
      </div>
    </div>
  );
};
