
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useCreditsFetcher } from "@/components/dashboard/dashboard-tab/CreditsFetcher";
import { calculateYearlyExpenses, calculateMonthlyExpenses, calculateTotalSavings } from "@/utils/dashboardCalculations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "lucide-react";
import { motion } from "framer-motion";

// Définir le schéma de validation pour le formulaire
const simulatorSchema = z.object({
  contributorsIncomes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      income: z.coerce.number().min(0, "Le revenu doit être positif")
    })
  ),
  savingsGoalPercentage: z.coerce.number().min(0, "Le pourcentage doit être positif").max(100, "Le pourcentage ne peut pas dépasser 100%")
});

type SimulatorFormValues = z.infer<typeof simulatorSchema>;

interface BudgetSimulatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetSimulatorDialog({ open, onOpenChange }: BudgetSimulatorDialogProps) {
  // Récupérer les données du tableau de bord
  const { contributors, recurringExpenses } = useDashboardData();
  const { data: credits = [] } = useCreditsFetcher();
  
  // Configurer le formulaire
  const form = useForm<SimulatorFormValues>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      contributorsIncomes: [],
      savingsGoalPercentage: 20
    }
  });

  // État pour les résultats calculés
  const [results, setResults] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalCredits: 0,
    savingsAmount: 0,
    availableAmount: 0
  });

  // Initialiser le formulaire avec les données des contributeurs
  useEffect(() => {
    if (contributors.length > 0) {
      form.setValue(
        "contributorsIncomes", 
        contributors.map(contributor => ({
          id: contributor.id,
          name: contributor.name,
          income: contributor.total_contribution
        }))
      );
    }
  }, [contributors, form]);

  // Calculer les résultats lorsque le formulaire change
  const calculateResults = (values: SimulatorFormValues) => {
    // Calculer le revenu total
    const totalIncome = values.contributorsIncomes.reduce(
      (sum, contributor) => sum + contributor.income, 
      0
    );
    
    // Calculer les dépenses mensuelles
    const monthlyExpenses = calculateMonthlyExpenses(recurringExpenses);
    
    // Calculer le montant des crédits
    const now = new Date();
    const totalCredits = credits.reduce((sum, credit) => {
      if (credit.statut === 'actif') {
        return sum + credit.montant_mensualite;
      }
      return sum;
    }, 0);
    
    // Calculer le montant de l'épargne
    const savingsAmount = (totalIncome * values.savingsGoalPercentage) / 100;
    
    // Calculer le montant disponible
    const availableAmount = totalIncome - monthlyExpenses - totalCredits - savingsAmount;
    
    setResults({
      totalIncome,
      totalExpenses: monthlyExpenses,
      totalCredits,
      savingsAmount,
      availableAmount
    });
  };

  // Lors de la soumission du formulaire
  const onSubmit: SubmitHandler<SimulatorFormValues> = (values) => {
    calculateResults(values);
  };

  // Lorsque le formulaire change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      // Vérifier si toutes les données nécessaires sont disponibles
      if (
        value.contributorsIncomes?.every(c => c.income !== undefined) &&
        value.savingsGoalPercentage !== undefined
      ) {
        calculateResults(value as SimulatorFormValues);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto touch-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Currency className="h-6 w-6 text-primary" />
            Simulateur de budget
          </DialogTitle>
          <DialogDescription>
            Simulez votre budget en ajustant les revenus et l'objectif d'épargne.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Revenus des contributeurs</h3>
              
              {form.getValues().contributorsIncomes.map((contributor, index) => (
                <FormField
                  key={contributor.id}
                  control={form.control}
                  name={`contributorsIncomes.${index}.income`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-4">
                        <FormLabel className="w-1/3 min-w-[120px]">{contributor.name}</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              type="number"
                              {...field}
                              className="pl-8"
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="pt-4 pb-2">
                <h3 className="text-lg font-medium mb-4">Objectif d'épargne</h3>
                <FormField
                  control={form.control}
                  name="savingsGoalPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FormLabel>Pourcentage du revenu (%)</FormLabel>
                          <span className="font-medium text-primary">
                            {field.value}%
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => {
                              field.onChange(vals[0]);
                            }}
                            className="pt-2"
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground">
                          Cela représente un montant de {results.savingsAmount.toFixed(2)}€ par mois
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Résultats</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-5">
                    <p className="text-2xl font-bold">{results.totalIncome.toFixed(2)}€</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium">Dépenses totales</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-5">
                    <p className="text-2xl font-bold">{results.totalExpenses.toFixed(2)}€</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium">Crédits mensuels</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-5">
                    <p className="text-2xl font-bold">{results.totalCredits.toFixed(2)}€</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium">Épargne</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-5">
                    <p className="text-2xl font-bold">{results.savingsAmount.toFixed(2)}€</p>
                  </CardContent>
                </Card>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "p-4 rounded-lg border",
                  results.availableAmount >= 0 
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                )}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Montant disponible</h4>
                  <p className={cn(
                    "text-2xl font-bold",
                    results.availableAmount >= 0 
                      ? "text-green-700 dark:text-green-400" 
                      : "text-red-700 dark:text-red-400"
                  )}>
                    {results.availableAmount.toFixed(2)}€
                  </p>
                </div>
                
                {results.availableAmount < 0 && (
                  <Alert className="mt-4 bg-red-100/80 dark:bg-red-900/30 border-red-300 dark:border-red-800/40">
                    <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-700 dark:text-red-400">
                      Attention, votre budget est négatif. Ajustez vos revenus ou réduisez votre objectif d'épargne.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fermer
              </Button>
              <Button type="submit">Calculer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
