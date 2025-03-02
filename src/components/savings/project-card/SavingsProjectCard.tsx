
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsProject } from "@/types/savings-project";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";

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
    if (project.statut === 'actif') return "default";
    return "outline";
  };

  const getBadgeText = (project: SavingsProject) => {
    if (project.statut === 'dépassé') return "Dépassé";
    if (project.statut === 'actif') return "Actif";
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
      className="perspective-1000 h-full pb-4"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.03, 
        rotateY: 5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="flex flex-col backface-hidden transform-gpu shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div 
          className="h-48 relative cursor-pointer overflow-hidden rounded-t-lg"
          onClick={() => onSelect(project)}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={project.image_url || "/placeholder.svg"}
            alt={project.nom_projet}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <CardContent className="pt-4 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold truncate">{project.nom_projet}</h3>
            <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                onClick={() => onDelete(project)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          
          <div className="mt-auto space-y-4">
            {project.montant_mensuel && project.montant_mensuel > 0 && project.statut === 'actif' && (
              <div>
                <p className="text-sm font-medium mb-2">Progression:</p>
                <Progress value={calculateProgress(project)} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
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
    </motion.div>
  );
};
