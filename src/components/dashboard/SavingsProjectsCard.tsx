
import { CalendarClock, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SavingsProject } from "@/types/savings-project";

interface SavingsProjectsCardProps {
  savingsProjects: SavingsProject[];
  isLoading?: boolean;
}

export const SavingsProjectsCard = ({ 
  savingsProjects = [], 
  isLoading = false 
}: SavingsProjectsCardProps) => {
  if (isLoading) {
    return <SavingsProjectsCardSkeleton />;
  }

  // Calculer les projets actifs et leur montant total
  const activeProjects = savingsProjects.filter(project => project.statut === 'actif');
  const totalMonthlyAmount = activeProjects.reduce((total, project) => {
    // Si le projet utilise un montant mensuel, l'ajouter
    if (project.mode_planification === 'par_mensualite' && project.montant_mensuel) {
      return total + project.montant_mensuel;
    }
    // Sinon, calculer une mensualité approximative
    else if (project.mode_planification === 'par_date' && project.target_date) {
      const targetDate = new Date(project.target_date);
      const now = new Date();
      const monthsRemaining = Math.max(1, 
        (targetDate.getFullYear() - now.getFullYear()) * 12 + 
        (targetDate.getMonth() - now.getMonth())
      );
      return total + (project.montant_total / monthsRemaining);
    }
    return total;
  }, 0);

  return (
    <Card className="relative overflow-hidden border-quaternary-100 dark:border-quaternary-800/50 shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-quaternary-100 dark:bg-quaternary-800/40 flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-quaternary-700 dark:text-quaternary-300" />
          </div>
          <div>
           <span className="dark:text-white">Projets d'épargne</span>
           
      
            <p className="text-sm text-quaternary-600/80 dark:text-quaternary-400/90">
              {activeProjects.length} projet{activeProjects.length !== 1 ? 's' : ''} actif{activeProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold text-quaternary-800 dark:text-quaternary-200">
            {totalMonthlyAmount.toLocaleString('fr-FR')} €
          </div>
          <p className="text-sm text-quaternary-600/80 dark:text-quaternary-400/90 flex items-center mt-1">
            <CalendarClock className="inline-block h-4 w-4 mr-1" />
            Épargne mensuelle totale
          </p>
        </div>

        {/* Gradient subtil */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r",
          "from-quaternary-400 via-emerald-300 to-transparent",
          "dark:from-quaternary-400 dark:via-emerald-500 dark:to-transparent"
        )} />
      </div>
    </Card>
  );
};

export const SavingsProjectsCardSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-3 w-40" />
      </div>
    </Card>
  );
};
