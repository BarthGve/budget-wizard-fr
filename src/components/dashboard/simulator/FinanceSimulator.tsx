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
import { Euro, BarChart3, X } from "lucide-react";
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

interface FinanceSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FinanceSimulator = ({ open, onOpenChange }: FinanceSimulatorProps) => {
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();
  const { data: profile } = useProfileFetcher();
  const { totalCreditPayments, isLoadingCredits } = useSimulatorDataFetcher();
  const [initialData, setInitialData] = useState<SimulatorData | null>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const currentMonthExpenses = calculateMonthlyExpenses(recurringExpenses);

  const actualMonthlySavingsAmount = (monthlySavings || []).reduce((acc, saving) => acc + (saving.amount || 0), 0);

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

  const loadingContent = (
    <div className="space-y-4 py-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  const DialogBackground = () => (
    <>
      <div className={cn(
        "absolute inset-0",
        "bg-gradient-to-b from-primary-50/70 to-white",
        "dark:from-primary-950/20 dark:to-gray-900/60",
        "pointer-events-none"
      )}>
        <div className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
          "from-primary-100/40 via-primary-50/20 to-transparent",
          "dark:from-primary-800/15 dark:via-primary-700/10 dark:to-transparent",
          "opacity-60"
        )} />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-primary-400 dark:fill-primary-600"
          style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
        >
          <circle cx={50} cy={50} r={50} />
        </svg>
      </div>
    </>
  );

  if (!initialData) {
    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="px-0 pb-0 rounded-t-xl h-[92vh] overflow-hidden border-t shadow-lg">
            <div className="absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="overflow-y-auto pb-safe pt-4 px-4">
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
                <BarChart3 className="h-5 w-5 text-primary" />
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
      actualMonthlySavings={actualMonthlySavingsAmount}
    />
  ) : (
    <DesktopFinanceSimulator
      open={open}
      onOpenChange={onOpenChange}
      initialData={initialData}
      profile={profile}
      actualMonthlySavings={actualMonthlySavingsAmount}
    />
  );
};

const MobileFinanceSimulator = ({ 
  open, 
  onOpenChange, 
  initialData, 
  profile,
  actualMonthlySavings
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  initialData: SimulatorData;
  profile: any;
  actualMonthlySavings: number;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom"
        className="px-0 pb-0 rounded-t-xl h-[92vh] overflow-hidden border-t shadow-lg"
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
                  <div className="p-2 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-primary-900 dark:text-primary-200">
                      Simulateur Financier
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-primary-700/80 dark:text-primary-300/80 line-clamp-2">
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
            actualMonthlySavings={actualMonthlySavings}
            className="px-4 pb-20" 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DesktopFinanceSimulator = ({ 
  open, 
  onOpenChange, 
  initialData, 
  profile,
  actualMonthlySavings
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  initialData: SimulatorData;
  profile: any;
  actualMonthlySavings: number;
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
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className={cn(
              "p-0 border-0 relative overflow-hidden",
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[650px] translate-x-[-50%] translate-y-[-50%] gap-0",
              "bg-white dark:bg-gray-900",
              isTablet ? "sm:max-w-[85%] w-[85%]" : "w-[90vw]",
              "max-h-[90vh]"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)",
            }}
          >
            <div className={cn(
              "absolute inset-0",
              "bg-gradient-to-b from-primary-50/70 to-white",
              "dark:from-primary-950/20 dark:to-gray-900/60",
              "pointer-events-none"
            )}>
              <div className={cn(
                "absolute inset-0",
                "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
                "from-primary-100/40 via-primary-50/20 to-transparent",
                "dark:from-primary-800/15 dark:via-primary-700/10 dark:to-transparent",
                "opacity-60"
              )} />
            </div>

            <button 
              onClick={handleClose}
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
                "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2",
                "focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                "z-20"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>

            <div className="relative z-10 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-700">
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6 pb-0"
              >
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                      <BarChart3 size={22} />
                    </div>
                    <div>
                      <DialogTitle className="text-xl sm:text-2xl font-bold text-primary-900 dark:text-primary-200">
                        Simulateur Financier
                      </DialogTitle>
                      <DialogDescription className="mt-1.5 text-base text-primary-700/80 dark:text-primary-300/80">
                        Simulez vos finances en ajustant vos revenus et votre objectif d'épargne.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </motion.div>

              <SimulatorContent 
                initialData={initialData} 
                profile={profile} 
                onClose={() => onOpenChange(false)}
                actualMonthlySavings={actualMonthlySavings}
                className="p-6" 
              />
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full fill-primary-400 dark:fill-primary-600"
                style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
              >
                <circle cx={50} cy={50} r={50} />
              </svg>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

const SimulatorContent = ({ 
  initialData, 
  profile, 
  onClose,
  actualMonthlySavings,
  className
}: { 
  initialData: SimulatorData; 
  profile: any;
  onClose: () => void;
  actualMonthlySavings: number;
  className?: string;
}) => {
  const {
    data,
    totalRevenue,
    savingsAmount,
    scheduledSavingsAmount,
    remainingAmount,
    updateContributor,
    updateSavingsGoal,
    applyChanges,
    isUpdating,
  } = useFinanceSimulator(
    initialData,
    profile,
    onClose,
    actualMonthlySavings
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className={cn("space-y-6", className)}
    >
      <div>
        <h3 className="text-sm font-medium mb-3">Revenus des contributeurs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.contributors.map((contributor) => (
            <div key={contributor.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor={`contributor-${contributor.id}`} className="text-sm">
                  {contributor.name} {contributor.is_owner ? "(Vous)" : ""}
                </Label>
                <span className="text-sm font-medium">
                  {formatCurrency(contributor.total_contribution)} €
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id={`contributor-${contributor.id}`}
                  type="number"
                  min={0}
                  value={contributor.total_contribution}
                  onChange={(e) => updateContributor(contributor.id, Number(e.target.value))}
                  className="w-full"
                />
                <Euro className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Objectif d'épargne (%)</h3>
          <span className="text-sm font-medium">{data.savingsGoalPercentage}%</span>
        </div>
        <Slider
          value={[data.savingsGoalPercentage]}
          min={0}
          max={50}
          step={1}
          rangeClassName="bg-primary-500 dark:bg-primary-400"
          thumbClassName="border-2 border-primary bg-background hover:bg-primary" 
          onValueChange={(value) => updateSavingsGoal(value[0])}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Montant d'épargne visé: {formatCurrency(savingsAmount)} €
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Total des revenus:</span>
          <span className="font-medium">{formatCurrency(totalRevenue)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Charges:</span>
          <span className="font-medium text-red-500">-{formatCurrency(data.expenses)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Crédits:</span>
          <span className="font-medium text-red-500">-{formatCurrency(data.creditPayments)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Épargne:</span>
          <span className="font-medium text-amber-500">-{formatCurrency(scheduledSavingsAmount)} €</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-base font-medium">Solde disponible:</span>
          <span className={cn(
            "font-bold",
            remainingAmount >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {formatCurrency(remainingAmount)} €
          </span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          Annuler
        </Button>
        <Button className="bg-primary-500 hover:bg-primary-700 text-white" onClick={applyChanges} disabled={isUpdating}>
          {isUpdating ? "Application en cours..." : "Appliquer ces modifications"}
        </Button>
      </DialogFooter>
    </motion.div>
  );
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
