
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsProject } from "@/types/savings-project";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";

interface SavingsProjectCardProps {
  project: SavingsProject;
  onDelete: (project: SavingsProject) => void;
  onSelect: (project: SavingsProject) => void;
}

export const SavingsProjectCard = ({ project, onDelete, onSelect }: SavingsProjectCardProps) => {
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

  return (
    <Card className="flex flex-col">
      <div 
        className="aspect-video relative cursor-pointer"
        onClick={() => onSelect(project)}
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
            onClick={() => onDelete(project)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {project.montant_mensuel && project.montant_mensuel > 0 && project.statut === 'actif' && (
            <div>
              <p className="text-sm font-medium mb-2">Progression:</p>
              <Progress value={calculateProgress(project)} className="h-2" />
            </div>
          )}
          
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
  );
};
