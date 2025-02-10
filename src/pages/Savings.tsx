
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
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  PiggyBank,
  Target,
  TrendingUp,
  LineChart,
  Calendar,
  Plus,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
}

const Savings = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(1000);
  const [savingsPercentage, setSavingsPercentage] = useState(15);
  const monthlyIncome = 5000; // À connecter avec les données réelles
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchSavingsGoals = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les objectifs d'épargne",
        variant: "destructive",
      });
      return;
    }

    setSavingsGoals(data || []);
  };

  useEffect(() => {
    fetchSavingsGoals();
  }, []);

  const addNewGoal = async () => {
    if (!newGoalName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre objectif d'épargne",
        variant: "destructive",
      });
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { error } = await supabase.from("savings_goals").insert({
      name: newGoalName,
      target_amount: newGoalTarget,
      current_amount: 0,
      monthly_contribution: (monthlyIncome * savingsPercentage) / 100,
      profile_id: session.session.user.id,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'objectif d'épargne",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Objectif d'épargne ajouté",
    });

    setNewGoalName("");
    setNewGoalTarget(1000);
    fetchSavingsGoals();
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from("savings_goals").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'objectif d'épargne",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Objectif d'épargne supprimé",
    });

    fetchSavingsGoals();
  };

  const totalSavings = savingsGoals.reduce(
    (acc, goal) => acc + goal.current_amount,
    0
  );
  const totalTarget = savingsGoals.reduce(
    (acc, goal) => acc + goal.target_amount,
    0
  );
  const projectedMonthlySavings = (monthlyIncome * savingsPercentage) / 100;

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
          {/* Ajouter un nouvel objectif */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <CardTitle>Nouvel objectif d'épargne</CardTitle>
              </div>
              <CardDescription>
                Définissez un nouvel objectif d'épargne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Nom de l'objectif</Label>
                <Input
                  id="goal-name"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="Ex: Vacances, Voiture..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Montant cible</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                  placeholder="Entrez votre objectif"
                />
              </div>
              <Button onClick={addNewGoal} className="w-full">
                Ajouter l'objectif
              </Button>
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
                    {projectedMonthlySavings}€ / mois
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des objectifs */}
          {savingsGoals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle>{goal.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Progression de votre objectif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress
                  value={(goal.current_amount / goal.target_amount) * 100}
                />
                <p className="text-sm text-muted-foreground">
                  {goal.current_amount}€ / {goal.target_amount}€
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Contribution mensuelle:</span>
                  <span className="font-medium">
                    {goal.monthly_contribution}€ / mois
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Prévisions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Prévisions globales</CardTitle>
              </div>
              <CardDescription>Projection de votre épargne totale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Épargne actuelle:</p>
                  <p className="text-2xl font-bold">{totalSavings}€</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Objectif total:</p>
                  <p className="text-2xl font-bold text-right">{totalTarget}€</p>
                </div>
              </div>
              <Progress value={(totalSavings / totalTarget) * 100} />
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

