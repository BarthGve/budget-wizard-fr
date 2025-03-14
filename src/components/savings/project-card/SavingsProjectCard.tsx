
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsProject } from "@/types/savings-project";
import { Trash2, PiggyBank, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface SavingsProjectCardProps {
  project: SavingsProject;
  onDelete: (project: SavingsProject) => void;
  onSelect: (project: SavingsProject) => void;
  index?: number;
  isVisible?: boolean;
}

export const SavingsProjectCard = ({ 
  project, 
  onDelete, 
  onSelect, 
  index = 0, 
  isVisible = true 
}: SavingsProjectCardProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
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

  const savedAmount = calculateSavedAmount(project);
  const progressPercentage = calculateProgress(project);
  const remainingAmount = project.montant_total - savedAmount;
  const isComplete = progressPercentage >= 100;

  // Modifié pour retourner uniquement des types valides pour le composant Badge
  const getBadgeVariant = (project: SavingsProject): "default" | "destructive" | "secondary" | "outline" => {
    if (project.statut === 'dépassé' || progressPercentage >= 100) return "secondary"; // Remplacé 'success' par 'secondary'
    if (project.statut === 'actif') return "default";
    return "outline";
  };

  const getBadgeText = (project: SavingsProject) => {
    if (project.statut === 'dépassé' || progressPercentage >= 100) return "Objectif atteint";
    if (project.statut === 'actif') return "En cours";
    return "En attente";
  };

  const cardVariants = {
    visible: {
      opacity: 1,
      rotateY: 0,
      y: 0,
      scale: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: index * 0.05
      }
    },
    hidden: {
      opacity: 0,
      rotateY: -90,
      y: 20,
      scale: 0.8,
      height: 0,
      margin: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="perspective-1000 h-full pb-4 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.02, 
        y: -3,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn(
        "flex flex-col backface-hidden transform-gpu h-full border overflow-hidden relative",
        // Light mode
        "bg-white border-emerald-100 hover:border-emerald-200",
        // Dark mode
        "dark:bg-gray-800 dark:border-emerald-900/40 dark:hover:border-emerald-800/50"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 4px 20px -4px rgba(0, 100, 70, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px -4px rgba(16, 185, 129, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <div 
          className="h-48 relative cursor-pointer overflow-hidden"
          onClick={() => onSelect(project)}
        >
          {/* Badge overlay for status */}
          <div className="absolute top-3 left-3 z-10">
            <Badge 
              variant={getBadgeVariant(project)} 
              className={cn(
                "font-medium shadow-sm",
                isComplete 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white border-none"
                  : "border-emerald-200 dark:border-emerald-800/50"
              )}
            >
              {isComplete && <TrendingUp className="h-3 w-3 mr-1" />}
              {getBadgeText(project)}
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

        <CardContent className={cn(
          "pt-4 flex-1 flex flex-col justify-between space-y-4",
          // Light mode specific gradient background for content
          "bg-gradient-to-b from-white to-emerald-50/30",
          // Dark mode specific gradient
          "dark:bg-gradient-to-b dark:from-gray-800 dark:to-emerald-900/10"
        )}>
          {/* Progress section */}
          {project.montant_mensuel && project.montant_mensuel > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <PiggyBank className={cn(
                    "h-4 w-4 mr-1.5",
                    "text-emerald-500 dark:text-emerald-400"
                  )} />
                  <span className={cn(
                    "font-medium",
                    "text-emerald-700 dark:text-emerald-300"
                  )}>
                    Épargne accumulée
                  </span>
                </div>
                <span className="font-semibold">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              
              {/* Progress bar with animated gradient for completed projects */}
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full rounded-full",
                    isComplete
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500"
                      : "bg-emerald-500 dark:bg-emerald-400"
                  )}
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          )}
          
          {/* Amounts section */}
          <div className="grid grid-cols-2 gap-3 pb-1">
            <div className={cn(
              "p-2.5 rounded-lg",
              // Light mode
              "bg-emerald-50 border border-emerald-100",
              // Dark mode
              "dark:bg-emerald-900/20 dark:border-emerald-800/30"
            )}>
              <p className="text-xs text-muted-foreground mb-1">Épargné</p>
              <p className={cn(
                "font-bold",
                "text-emerald-700 dark:text-emerald-300"
              )}>
                {formatCurrency(savedAmount)}
              </p>
            </div>
            
            <div className={cn(
              "p-2.5 rounded-lg",
              // Light mode
              "bg-gray-50 border border-gray-200",
              // Dark mode
              "dark:bg-gray-800 dark:border-gray-700"
            )}>
              <p className="text-xs text-muted-foreground mb-1">Objectif</p>
              <p className="font-bold">
                {formatCurrency(project.montant_total)}
              </p>
            </div>
          </div>
          
          {/* Call to action */}
          <motion.div 
            className="mt-auto"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => onSelect(project)}
              className={cn(
                "w-full py-2 px-3 rounded-md flex items-center justify-between text-sm font-medium transition-colors",
                // Light mode
                "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
                // Dark mode
                "dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/30"
              )}
            >
              <span>Voir les détails</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
