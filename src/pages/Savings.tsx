
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  PiggyBank,
  Target,
  TrendingUp,
  LineChart,
  Calendar,
} from "lucide-react";

const Savings = () => {
  // État temporaire en attendant l'intégration avec Supabase
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [currentSavings] = useState(750);
  const [savingsPercentage, setSavingsPercentage] = useState(15);
  const monthlyIncome = 5000; // À connecter avec les données réelles

  const projectedSavings = (monthlyIncome * savingsPercentage) / 100;
  const monthsToGoal = Math.ceil(
    (savingsGoal - currentSavings) / projectedSavings
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Épargne</h1>
          <p className="text-muted-foreground">
            Gérez vos objectifs d'épargne et suivez votre progression
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Objectif d'épargne */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Objectif d'épargne</CardTitle>
              </div>
              <CardDescription>Définissez votre objectif d'épargne</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="savings-goal">Montant cible</Label>
                <Input
                  id="savings-goal"
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  placeholder="Entrez votre objectif"
                />
              </div>
              <Progress value={(currentSavings / savingsGoal) * 100} />
              <p className="text-sm text-muted-foreground">
                {currentSavings}€ / {savingsGoal}€
              </p>
            </CardContent>
          </Card>

          {/* Pourcentage d'épargne */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <CardTitle>Taux d'épargne mensuel</CardTitle>
              </div>
              <CardDescription>
                Pourcentage de vos revenus à épargner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Slider
                  value={[savingsPercentage]}
                  onValueChange={([value]) => setSavingsPercentage(value)}
                  max={50}
                  step={1}
                />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {savingsPercentage}% de vos revenus
                  </span>
                  <span className="text-sm font-medium">
                    {projectedSavings}€ / mois
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prévisions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Prévisions</CardTitle>
              </div>
              <CardDescription>Projection de votre épargne</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Objectif atteint dans:</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-2xl font-bold">
                      {monthsToGoal} {monthsToGoal > 1 ? "mois" : "mois"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Épargne projetée:</p>
                  <p className="text-2xl font-bold text-right">
                    {projectedSavings * 12}€
                    <span className="text-sm text-muted-foreground">/an</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <CardTitle>Historique</CardTitle>
              </div>
              <CardDescription>Suivi de votre épargne</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Graphique à venir avec l'intégration Supabase
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Savings;
