
import { formatCurrency } from "@/utils/format";
import { SavingsProject } from "@/types/savings-project";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { differenceInDays } from "date-fns";

interface SavingsProjectDetailsProps {
  project: SavingsProject | null;
  onClose: () => void;
}

export const SavingsProjectDetails = ({ project, onClose }: SavingsProjectDetailsProps) => {
  if (!project) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.nom_projet}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video relative">
            <img
              src={project.image_url || "/placeholder.svg"}
              alt={project.nom_projet}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
          
          {project.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Objectif</h3>
              <p className="text-2xl font-bold">{formatCurrency(project.montant_total)}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Date de création</h3>
              <p>{formatDate(project.created_at)}</p>
            </div>

            {project.montant_mensuel && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Déjà épargné</h3>
                  <p className="text-2xl font-bold">{formatCurrency(calculateSavedAmount(project))}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Versement mensuel</h3>
                  <p>{formatCurrency(project.montant_mensuel)} / mois</p>
                </div>
              </>
            )}

            {project.date_estimee && (
              <div>
                <h3 className="font-semibold mb-2">Date d'objectif estimée</h3>
                <p>{new Date(project.date_estimee).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long'
                })}</p>
              </div>
            )}
          </div>

          {project.montant_mensuel && project.montant_mensuel > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Progression</h3>
              <Progress value={calculateProgress(project)} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(calculateProgress(project))}% de l'objectif atteint
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
