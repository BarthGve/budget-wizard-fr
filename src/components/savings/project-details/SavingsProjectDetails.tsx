
import { formatCurrency } from "@/utils/format";
import { SavingsProject } from "@/types/savings-project";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, Wallet, Clock, Target, TrendingUp } from "lucide-react";

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
  
  const savedAmount = calculateSavedAmount(project);
  const progressValue = calculateProgress(project);

  // Définition des couleurs pour le thème vert cohérent
  const colors = {
    gradientFrom: "from-quaternary-50",
    gradientTo: "to-quaternary-100",
    darkGradientFrom: "dark:from-quaternary-950",
    darkGradientTo: "dark:to-quaternary-900",
    borderLight: "border-quaternary-100/70",
    borderDark: "dark:border-quaternary-800/20",
  };

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-md p-0 border-0 shadow-lg rounded-lg overflow-hidden",
        "bg-gradient-to-br",
        colors.gradientFrom,
        colors.gradientTo,
        colors.darkGradientFrom,
        colors.darkGradientTo,
        colors.borderLight,
        colors.borderDark
      )}>
        <div className={cn(
          "relative flex flex-col pb-6 p-5 rounded-lg w-full h-full",
          "bg-gradient-to-br",
          "from-white via-quaternary-50/40 to-quaternary-100/70",
          "dark:from-gray-900 dark:via-quaternary-950/20 dark:to-quaternary-900/30"
        )}>
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br from-quaternary-500 to-emerald-400 dark:from-quaternary-700 dark:to-emerald-600 rounded-lg" />
          
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-quaternary-800 dark:text-quaternary-300">
              {project.nom_projet}
            </DialogTitle>
            {project.description && (
              <DialogDescription className="text-sm text-quaternary-700/80 dark:text-quaternary-400/80 mt-1">
                {project.description}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="aspect-video relative rounded-md overflow-hidden">
              <img
                src={project.image_url || "/placeholder.svg"}
                alt={project.nom_projet}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Progress section */}
            {project.montant_mensuel && project.montant_mensuel > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-quaternary-700 dark:text-quaternary-400 font-medium">Progression</span>
                  <span className="text-quaternary-800 dark:text-quaternary-300">
                    {Math.round(progressValue)}%
                  </span>
                </div>
                <Progress 
                  value={progressValue} 
                  className="h-1.5 bg-quaternary-100 dark:bg-quaternary-800/30"
                  indicatorClassName="bg-quaternary-600 dark:bg-quaternary-500"
                />
                <div className="flex justify-between text-xs text-quaternary-600/70 dark:text-quaternary-500/70">
                  <span>{formatCurrency(savedAmount)}</span>
                  <span>{formatCurrency(project.montant_total)}</span>
                </div>
              </div>
            )}
            
            {/* Key information grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem 
                icon={<Target className="h-4 w-4 text-quaternary-600 dark:text-quaternary-500" />}
                label="Objectif"
                value={formatCurrency(project.montant_total)}
                highlight
              />
              
              {project.montant_mensuel && (
                <InfoItem 
                  icon={<Wallet className="h-4 w-4 text-quaternary-600 dark:text-quaternary-500" />}
                  label="Versement mensuel"
                  value={`${formatCurrency(project.montant_mensuel)}/mois`}
                />
              )}
              
              {savedAmount > 0 && (
                <InfoItem 
                  icon={<TrendingUp className="h-4 w-4 text-quaternary-600 dark:text-quaternary-500" />}
                  label="Déjà épargné"
                  value={formatCurrency(savedAmount)}
                />
              )}
              
              <InfoItem 
                icon={<Calendar className="h-4 w-4 text-quaternary-600 dark:text-quaternary-500" />}
                label="Date de création"
                value={formatDate(project.created_at)}
              />
              
              {project.date_estimee && (
                <InfoItem 
                  icon={<Clock className="h-4 w-4 text-quaternary-600 dark:text-quaternary-500" />}
                  label="Date d'objectif"
                  value={new Date(project.date_estimee).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long'
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant plus compact pour les informations
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  highlight = false 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div className="shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-quaternary-600 dark:text-quaternary-400 font-medium mb-0.5">{label}</p>
      <p className={cn(
        "truncate",
        highlight 
          ? "text-sm font-semibold text-quaternary-800 dark:text-quaternary-300" 
          : "text-xs text-gray-700 dark:text-gray-300"
      )}>
        {value}
      </p>
    </div>
  </div>
);
