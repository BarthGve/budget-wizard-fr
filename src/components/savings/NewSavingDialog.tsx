import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface SavingsGoalSectionProps {
  profile: {
    savings_goal_percentage: number;
  } | null;
  totalMonthlyAmount: number;
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
  }> | null;
  open?: boolean; // Propriété contrôlée
  onOpenChange?: (open: boolean) => void; // Handler de changement d'état
}

export const SavingsGoalSection = ({
  profile,
  totalMonthlyAmount,
  monthlySavings,
  open: controlledOpen,
  onOpenChange,
}: SavingsGoalSectionProps) => {
  const [localOpen, setLocalOpen] = useState(false); // État non contrôlé pour le dialogue
  const contentRef = useRef<HTMLDivElement>(null); // Référence pour le contenu
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  // Déterminer si on utilise l'état contrôlé ou non
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : localOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(newOpen); // Gestion de l'état contrôlé via le parent
    } else {
      setLocalOpen(newOpen); // Gestion de l'état local
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Déclencheur du dialogue (par exemple, un bouton ou un lien) */}
      <DialogTrigger asChild>
        <Button variant="outline" className="text-green-800 dark:text-green-400">
          Voir l'objectif d'épargne
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "p-0 overflow-hidden max-w-[90vw] sm:max-w-[650px]",
          "bg-gradient-to-b from-green-50/70 via-green-100 to-white dark:from-gray-900 dark:to-green-900/10",
          "border border-green-100 dark:border-green-800"
        )}
      >
        <div
          ref={contentRef}
          className="flex flex-col max-h-[80vh] overflow-y-auto relative bg-white"
        >
          {/* Section d'en-tête */}
          <DialogHeader className="py-4 px-6 space-y-3 bg-green-50 dark:bg-green-950/20 z-10">
            <DialogTitle className="text-xl font-bold text-green-800 dark:text-green-300">
              Objectif d'Épargne
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gérez vos objectifs et visualisez votre répartition d'épargne.
            </p>
          </DialogHeader>

          {/* Séparation visuelle */}
          <div className="h-1 bg-gradient-to-r from-green-300 via-transparent to-green-300" />

          {/* Contenu principal */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              {/* Composant `SavingsGoal` */}
              <SavingsGoal
                savingsPercentage={profile?.savings_goal_percentage || 0}
                totalMonthlyAmount={totalMonthlyAmount}
              />
            </div>

            <div>
              {/* Composant graphique `SavingsPieChart` */}
              <SavingsPieChart
                monthlySavings={monthlySavings || []}
                totalSavings={totalMonthlyAmount}
              />
            </div>
          </div>

          {/* Pied de page avec des actions */}
          <DialogFooter className="flex gap-2 px-6 py-4 bg-green-50 dark:bg-green-950/20 border-t border-green-200 dark:border-green-800">
            <Button
              variant="outline"
              className="text-green-800 dark:text-green-400 dark:hover:bg-green-900/20 border-green-300 dark:border-green-800"
              onClick={() => handleOpenChange(false)}
            >
              Fermer
            </Button>
            <Button
              onClick={() => alert("Modifier les objectifs !")} // Placeholder pour une autre action
              className="bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-600"
            >
              Modifier les objectifs
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
