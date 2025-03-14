
import { Card, CardContent } from "@/components/ui/card";
import { SavingsProject } from "@/types/savings-project";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CardHeader } from "./components/CardHeader";
import { ProgressSection } from "./components/ProgressSection";
import { AmountsSection } from "./components/AmountsSection";
import { CardFooter } from "./components/CardFooter";
import { useProjectCardCalculations } from "./hooks/useProjectCardCalculations";

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
  
  // Calculs liés au projet d'épargne
  const { savedAmount, progressPercentage, isComplete } = useProjectCardCalculations(project);

  // Animation pour l'apparition/disparition des cartes
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
        {/* En-tête avec image et titre */}
        <CardHeader 
          project={project}
          onDelete={onDelete}
          onSelect={onSelect}
          progressPercentage={progressPercentage}
          isComplete={isComplete}
        />

        <CardContent className={cn(
          "pt-4 flex-1 flex flex-col justify-between space-y-4",
          // Light mode specific gradient background for content
          "bg-gradient-to-b from-white to-emerald-50/30",
          // Dark mode specific gradient
          "dark:bg-gradient-to-b dark:from-gray-800 dark:to-emerald-900/10"
        )}>
          {/* Section de progression */}
          {project.montant_mensuel && project.montant_mensuel > 0 && (
            <ProgressSection 
              progressPercentage={progressPercentage}
              isComplete={isComplete}
            />
          )}
          
          {/* Section des montants */}
          <AmountsSection 
            savedAmount={savedAmount}
            totalAmount={project.montant_total}
          />
          
          {/* Pied de carte avec bouton d'action */}
          <CardFooter 
            onSelect={onSelect}
            project={project}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
