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
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Calendar, Wallet, Clock, Target, TrendingUp, Info } from "lucide-react";

interface SavingsProjectDetailsProps {
  project: SavingsProject | null;
  onClose: () => void;
}

export const SavingsProjectDetails = ({ project, onClose }: SavingsProjectDetailsProps) => {
  if (!project) return null;
  
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

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
  const remainingAmount = project.montant_total - savedAmount;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <AnimatePresence>
        {project && (
          <DialogContent 
            forceMount
            className={cn(
              "p-0 overflow-hidden shadow-lg",
              isTablet ? "sm:max-w-[85%] w-[85%]" : "sm:max-w-[650px]",
              "max-h-[85vh]",
              "bg-gradient-to-b from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10",
              "border border-green-100/50 dark:border-green-900/30",
              "rounded-xl"
            )}
          >
            {/* Séparateur vert subtil en haut */}
            <div className="h-1 w-full bg-gradient-to-r from-green-200/20 via-green-400/40 to-green-200/20 dark:from-green-900/20 dark:via-green-800/30 dark:to-green-900/20" />
            
            <div className="p-6">
              <DialogHeader className="mb-4">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {project.nom_projet}
                  </DialogTitle>
                  
                  {progressValue > 0 && (
                    <div className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/40 text-sm font-medium text-green-700 dark:text-green-300 flex items-center space-x-1">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      <span>{Math.round(progressValue)}% complété</span>
                    </div>
                  )}
                </div>
                
                {project.description && (
                  <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    {project.description}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              <ScrollArea 
                className={cn(
                  "pr-4",
                  "max-h-[calc(85vh-14rem)]",
                  "scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent",
                  "dark:scrollbar-thumb-green-800"
                )}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="aspect-video relative overflow-hidden rounded-lg shadow-md">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.nom_projet}
                      className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                    
                    {/* Overlay pour améliorer la lisibilité de l'image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
                  </div>
                  
                  {/* Section progress bar */}
                  {project.montant_mensuel && project.montant_mensuel > 0 && (
                    <div className="space-y-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/50">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-sm text-green-700 dark:text-green-400">Progression</span>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                          {formatCurrency(savedAmount)} / {formatCurrency(project.montant_total)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={progressValue} 
                        className="h-2 bg-green-100 dark:bg-green-800/30"
                        // Barre de progression verte
                        style={{
                          "--progress-background": "rgba(220, 252, 231, 0.7)",
                          "--progress-foreground": "rgba(22, 163, 74, 0.8)"
                        } as React.CSSProperties}
                      />
                      
                      <div className="flex justify-between text-xs text-green-600 dark:text-green-500">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Grille d'informations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard 
                      icon={<Target className="h-5 w-5 text-green-600 dark:text-green-500" />}
                      title="Objectif"
                      value={formatCurrency(project.montant_total)}
                      highlight
                    />
                    
                    {project.montant_mensuel && (
                      <InfoCard 
                        icon={<Wallet className="h-5 w-5 text-green-600 dark:text-green-500" />}
                        title="Versement mensuel"
                        value={`${formatCurrency(project.montant_mensuel)} / mois`}
                      />
                    )}
                    
                    {savedAmount > 0 && (
                      <>
                        <InfoCard 
                          icon={<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />}
                          title="Déjà épargné"
                          value={formatCurrency(savedAmount)}
                          highlight
                        />
                        
                        <InfoCard 
                          icon={<Target className="h-5 w-5 text-green-600 dark:text-green-500" />}
                          title="Reste à épargner"
                          value={formatCurrency(remainingAmount)}
                        />
                      </>
                    )}
                    
                    <InfoCard 
                      icon={<Calendar className="h-5 w-5 text-green-600 dark:text-green-500" />}
                      title="Date de création"
                      value={formatDate(project.created_at)}
                    />
                    
                    {project.date_estimee && (
                      <InfoCard 
                        icon={<Clock className="h-5 w-5 text-green-600 dark:text-green-500" />}
                        title="Date d'objectif estimée"
                        value={new Date(project.date_estimee).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long'
                        })}
                      />
                    )}
                  </div>
                  
                  {/* Affichage du temps restant */}
                  {project.date_estimee && (
                    <div className="mt-6 p-4 bg-green-50/70 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50 flex items-start gap-3">
                      <div className="mt-1 rounded-full p-2 bg-green-100 dark:bg-green-800/30">
                        <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-300">À propos de ce projet</h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          Au rythme actuel, vous atteindrez votre objectif en {' '}
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {new Date(project.date_estimee).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'long'
                            })}
                          </span>
                          {remainingAmount > 0 && savedAmount > 0 ? (
                            <>
                              . Il vous reste {' '}
                              <span className="font-medium text-green-800 dark:text-green-200">
                                {formatCurrency(remainingAmount)}
                              </span>
                              {' '} à épargner.
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </ScrollArea>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

// Composant pour les cartes d'information avec thème vert
const InfoCard = ({ 
  icon, 
  title, 
  value, 
  highlight = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  highlight?: boolean;
}) => (
  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100 dark:border-green-900/40 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-green-600 dark:text-green-400">{title}</h3>
        <p className={cn(
          "mt-1",
          highlight 
            ? "text-xl font-bold text-green-800 dark:text-green-300" 
            : "text-base text-gray-700 dark:text-gray-300"
        )}>
          {value}
        </p>
      </div>
    </div>
  </div>
);
