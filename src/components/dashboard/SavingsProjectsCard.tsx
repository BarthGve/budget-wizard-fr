import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SavingsProject } from "@/types/savings-project";
import { useState } from "react";
import { SavingsProjectsCarousel } from "@/components/savings/carousel/SavingsProjectsCarousel";

interface SavingsProjectsCardProps {
  savingsProjects: SavingsProject[];
  isLoading?: boolean;
}

export const SavingsProjectsCard = ({ 
  savingsProjects = [], 
  isLoading = false 
}: SavingsProjectsCardProps) => {
  const navigate = useNavigate();
  const [showCarousel, setShowCarousel] = useState(false);
  
  if (isLoading) {
    return <SavingsProjectsCardSkeleton />;
  }

  // Calculer les projets actifs et leur montant total
  const activeProjects = savingsProjects.filter(project => project.statut === 'actif');
   const stayingProjects = savingsProjects.filter(project => project.statut === 'en_attente');
  const totalMonthlyAmount = activeProjects.reduce((total, project) => {
    // Si un montant mensuel est déjà défini, l'utiliser
    if (project.montant_mensuel) {
      return total + project.montant_mensuel;
    }
    // Sinon, calculer le montant mensuel à partir de la date cible
    if (project.mode_planification === 'par_date' && project.target_date) {
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

  const descriptionText = activeProjects.length > 0 
    ? `Mobilise ${totalMonthlyAmount.toLocaleString('fr-FR')}€ d'épargne mensuelle`
    : "Aucun projet d'épargne actif";

  return (
    <>
      <div className="transition-all duration-300 transform hover:-translate-y-1">
        <Card 
          className={cn(
            "backdrop-blur-sm cursor-pointer transition-all duration-300 h-full",
            "shadow-lg border hover:shadow-xl",
            "dark:bg-quaternary/10 dark:border-quaternary/30 dark:shadow-quaternary/30 dark:hover:shadow-quaternary/50"
          )}
          onClick={() => setShowCarousel(true)}
        >
          <CardHeader className="py-4">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-full",
                  "bg-quaternary/20 text-quaternary",
                  "dark:bg-quaternary/20 dark:text-quaternary"
                )}>
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="dark:text-white">Projets</span>
                </div>
              </CardTitle>
            </div>
            <CardDescription className={cn("text-gray-500", "dark:text-gray-400")}>
              {descriptionText}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-4">
              <p className={cn(
                "text-xl font-bold leading-none", 
                "text-gray-800",
                "dark:text-quaternary",
                "animate-fadeIn"
              )}>
                {activeProjects.length} actif{activeProjects.length !== 1 ? 's' : ''} / {stayingProjects.length} en attente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <SavingsProjectsCarousel 
        projects={savingsProjects}
        open={showCarousel}
        onClose={() => setShowCarousel(false)}
      />
    </>
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
