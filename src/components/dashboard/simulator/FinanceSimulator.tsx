
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
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFinanceSimulator, SimulatorData } from "@/hooks/useFinanceSimulator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Euro, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useProfileFetcher } from "@/components/dashboard/dashboard-tab/ProfileFetcher";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSimulatorDataFetcher } from "./SimulatorDataFetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateMonthlyExpenses } from "@/utils/dashboardCalculations";

interface FinanceSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FinanceSimulator = ({ open, onOpenChange }: FinanceSimulatorProps) => {
  const { contributors, recurringExpenses } = useDashboardData();
  const { data: profile } = useProfileFetcher();
  const { totalCreditPayments, isLoadingCredits } = useSimulatorDataFetcher();
  const [initialData, setInitialData] = useState<SimulatorData | null>(null);

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

  // Si les données ne sont pas encore prêtes, afficher un skeleton
  if (!initialData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Simulateur Financier</DialogTitle>
            <DialogDescription>
              Chargement des données...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Simulateur Financier
          </DialogTitle>
          <DialogDescription>
            Simulez vos finances en ajustant vos revenus et votre objectif d'épargne.
          </DialogDescription>
        </DialogHeader>

        <SimulatorContent 
          initialData={initialData} 
          profile={profile} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

const SimulatorContent = ({ 
  initialData, 
  profile, 
  onClose 
}: { 
  initialData: SimulatorData; 
  profile: any;
  onClose: () => void;
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
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Revenus des contributeurs</h3>
        <div className="space-y-4">
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
          onValueChange={(value) => updateSavingsGoal(value[0])}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Montant d'épargne: {formatCurrency(savingsAmount)} €
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Total des revenus:</span>
          <span className="font-medium">{formatCurrency(totalRevenue)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Dépenses récurrentes:</span>
          <span className="font-medium text-red-500">-{formatCurrency(data.expenses)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Crédits:</span>
          <span className="font-medium text-red-500">-{formatCurrency(data.creditPayments)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Épargne:</span>
          <span className="font-medium text-amber-500">-{formatCurrency(savingsAmount)} €</span>
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
        <Button onClick={applyChanges} disabled={isUpdating}>
          {isUpdating ? "Application en cours..." : "Appliquer ces modifications"}
        </Button>
      </DialogFooter>
    </div>
  );
};
