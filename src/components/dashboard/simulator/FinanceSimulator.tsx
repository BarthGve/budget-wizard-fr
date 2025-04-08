
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFinanceSimulator, SimulatorData } from "@/hooks/useFinanceSimulator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Euro, Calculator, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useProfileFetcher } from "@/components/dashboard/dashboard-tab/ProfileFetcher";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSimulatorDataFetcher } from "./SimulatorDataFetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateMonthlyExpenses } from "@/utils/dashboardCalculations";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LoadingButton } from "@/components/ui/loading-button";

interface FinanceSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FinanceSimulator = ({ open, onOpenChange }: FinanceSimulatorProps) => {
  const { contributors, recurringExpenses } = useDashboardData();
  const { data: profile } = useProfileFetcher();
  const { totalCreditPayments, isLoadingCredits } = useSimulatorDataFetcher();
  const [initialData, setInitialData] = useState<SimulatorData | null>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Calculer les dépenses récurrentes uniquement pour le mois en cours
  const currentMonthExpenses = calculateMonthlyExpenses(recurringExpenses);

  // Préparer les données initiales pour le simulateur
  useEffect(() => {
    if (contributors.length > 0 && profile && !isLoadingCredits) {
      setInitialData({
        contributors: contributors.map((contributor) => ({
          id: contributor.id,
          name: contributor.name,
          total_contribution: contributor.total_contribution,
          is_owner: contributor.is_owner,
        })),
        savingsGoalPercentage: profile.savings_goal_percentage || 0,
        expenses: currentMonthExpenses,
        creditPayments: totalCreditPayments,
      });
    }
  }, [contributors, profile, currentMonthExpenses, totalCreditPayments, isLoadingCredits]);

  // Contenu de chargement
  const loadingContent = (
    <div className="space-y-4 py-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  // Fond de dialogue avec dégradé - adapté au style du bouton
  const DialogBackground = () => (
    <>
      <div className={cn(
        "absolute inset-0",
        "bg-white/80 backdrop-blur-sm",
        "dark:bg-gray-900/80",
        "pointer-events-none"
      )}>
        <div className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
          "from-white/40 via-primary/5 to-transparent",
          "dark:from-primary/10 dark:via-primary/5 dark:to-transparent",
          "opacity-60"
        )} />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-primary"
          style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
        >
          <circle cx={50} cy={50} r={50} />
        </svg>
      </div>
    </>
  );

  // Si les données ne sont pas encore prêtes, afficher un skeleton
  if (!initialData) {
    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="px-0 pb-0 rounded-t-xl h-[92vh] overflow-hidden border-t border-primary/20 dark:border-primary/30 shadow-lg">
            <div className="absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="h-full overflow-y-auto pb-safe pt-4 px-4">
              <DialogHeader>
                <DialogTitle>Simulateur Financier</DialogTitle>
                <DialogDescription>
                  Chargement des données...
                </DialogDescription>
              </DialogHeader>
              {loadingContent}
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0 border-0 relative overflow-hidden">
          <DialogBackground />
          <div className="relative z-10 p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Simulateur Financier
              </DialogTitle>
              <DialogDescription>
                Chargement des données...
              </DialogDescription>
            </DialogHeader>
            {loadingContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return isMobile ? (
    <MobileFinanceSimulator
      open={open}
      onOpenChange={onOpenChange}
      initialData={initialData}
      profile={profile}
    />
  ) : (
    <DesktopFinanceSimulator
      open={open}
      onOpenChange={onOpenChange}
      initialData={initialData}
      profile={profile}
    />
  );
};

// Composant pour le contenu du simulateur (utilisé par les versions mobile et desktop)
const SimulatorContent = ({ 
  initialData, 
  profile, 
  onClose,
  className
}: { 
  initialData: SimulatorData; 
  profile: any; 
  onClose?: () => void;
  className?: string;
}) => {
  const {
    data,
    totalRevenue,
    savingsAmount,
    remainingAmount,
    updateContributor,
    updateSavingsGoal,
    applyChanges,
    isUpdating,
  } = useFinanceSimulator(initialData, profile, onClose);

  return (
    <div className={cn("space-y-6 mt-6", className)}>
      {/* Section des contributeurs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contributeurs</h3>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
        
        {data.contributors.map((contributor) => (
          <div key={contributor.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">{contributor.name}</span>
                {contributor.is_owner && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Propriétaire
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-3.5 w-3.5 text-gray-500" />
                <Input
                  type="number"
                  value={contributor.total_contribution}
                  onChange={(e) => updateContributor(contributor.id, Number(e.target.value))}
                  className="h-8 w-24 text-right"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Section de l'objectif d'épargne */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Objectif d'épargne</Label>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(savingsAmount)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{data.savingsGoalPercentage}%</span>
            <span className="text-xs text-gray-500">50%</span>
          </div>
          <Slider
            value={[data.savingsGoalPercentage]}
            min={0}
            max={50}
            step={1}
            onValueChange={(value) => updateSavingsGoal(value[0])}
          />
        </div>
      </div>

      <Separator />

      {/* Section des dépenses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dépenses récurrentes</span>
          <span className="text-sm font-semibold text-red-500">
            {formatCurrency(data.expenses)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Crédits</span>
          <span className="text-sm font-semibold text-red-500">
            {formatCurrency(data.creditPayments)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Section du solde restant */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">Solde disponible</span>
        <span 
          className={cn(
            "text-base font-bold",
            remainingAmount >= 0 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-red-600 dark:text-red-400"
          )}
        >
          {formatCurrency(remainingAmount)}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-300 dark:border-gray-700"
        >
          Annuler
        </Button>
        <LoadingButton
          loading={isUpdating}
          onClick={applyChanges}
          disabled={isUpdating || remainingAmount < 0}
        >
          Appliquer les changements
        </LoadingButton>
      </div>
    </div>
  );
};

// Version mobile du simulateur
const MobileFinanceSimulator = ({ 
  open, 
  onOpenChange, 
  initialData, 
  profile 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  initialData: SimulatorData;
  profile: any;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom"
        className="px-0 pb-0 rounded-t-xl h-[92vh] overflow-hidden border-t border-primary/20 dark:border-primary/30 shadow-lg"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
        
        <div className="h-full overflow-y-auto pb-safe pt-4 px-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-700">
          <div className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/80 border border-primary/20 dark:bg-gray-900/80 dark:border-primary/30">
                    <Calculator size={18} className="text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Simulateur Financier
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      Simulez vos finances en ajustant vos revenus et votre objectif d'épargne.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </motion.div>
          </div>
          
          <SimulatorContent 
            initialData={initialData} 
            profile={profile} 
            onClose={() => onOpenChange(false)}
            className="px-4 pb-20" 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Version desktop du simulateur
const DesktopFinanceSimulator = ({ 
  open, 
  onOpenChange, 
  initialData, 
  profile 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  initialData: SimulatorData;
  profile: any;
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 border border-primary/20 dark:border-primary/30 relative overflow-hidden",
          "sm:max-w-[650px]",
          isTablet ? "sm:max-w-[85%] w-[85%]" : "w-[90vw]",
          "max-h-[90vh]"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(2, 6, 23, 0.3), 0 0 0 1px rgba(var(--primary), 0.1)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(var(--primary), 0.1)",
        }}
      >
        {/* Arrière-plan décoratif adapté au style du bouton */}
        <div className={cn(
          "absolute inset-0",
          "bg-white/80 backdrop-blur-sm",
          "dark:bg-gray-900/80",
          "pointer-events-none"
        )}>
          <div className={cn(
            "absolute inset-0",
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
            "from-white/40 via-primary/5 to-transparent",
            "dark:from-primary/10 dark:via-primary/5 dark:to-transparent",
            "opacity-60"
          )} />
        </div>

        <button 
          onClick={handleClose}
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
            "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2"
          )}
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 p-6">
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/80 border border-primary/20 dark:bg-gray-900/80 dark:border-primary/30">
                    <Calculator size={20} className="text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Simulateur Financier
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Simulez vos finances en ajustant vos revenus et votre objectif d'épargne.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </motion.div>
          </div>
          
          <SimulatorContent 
            initialData={initialData} 
            profile={profile} 
            onClose={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
