
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
    <motion.div 
  initial={{ opacity: 0, y: 10 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.4 }} 
  whileHover={{ y: -3 }}
>
  <Card 
    className={cn(
      "backdrop-blur-sm cursor-pointer transition-all duration-300 h-full",
      // Light mode styles
      "shadow-lg border hover:shadow-xl",
      // Dark mode styles
      "dark:bg-quaternary/10 dark:border-quaternary/30 dark:shadow-quaternary/30 dark:hover:shadow-quaternary/50"
    )}
  >
    <CardHeader className="py-4">
      <div className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full",
            "bg-quaternary/20 text-quaternary",
            "dark:bg-quaternary/20 dark:text-quaternary"
          )}>
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <span className="dark:text-white">Projets d'épargne</span>
            <p className={cn(
              "text-sm",
              "text-gray-500", 
              "dark:text-gray-400"
            )}>
              {activeProjects.length} projet{activeProjects.length !== 1 ? 's' : ''} actif{activeProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pb-4">
      <div className="space-y-4">
        <motion.p 
          className={cn(
            "text-xl font-bold leading-none", 
            "text-gray-800",
            "dark:text-quaternary"
          )} 
          initial={{ scale: 0.9 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          {totalMonthlyAmount.toLocaleString('fr-FR')} €
        </motion.p>
        <p className={cn(
          "text-sm flex items-center",
          "text-gray-500", 
          "dark:text-gray-400"
        )}>
          <CalendarClock className="inline-block h-4 w-4 mr-1" />
          Épargne mensuelle totale
        </p>
      </div>
    </CardContent>
  </Card>
</motion.div>
  );


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
