
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  PiggyBank,
  Plus,
  X,
  LineChart,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

const Savings = () => {
  const [monthlySavings, setMonthlySavings] = useState<MonthlySaving[]>([]);
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);
  const [newSavingDescription, setNewSavingDescription] = useState("");
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("savings_goal_percentage")
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences d'épargne",
        variant: "destructive",
      });
      return;
    }

    setSavingsPercentage(data?.savings_goal_percentage || 0);
  };

  const fetchMonthlySavings = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("monthly_savings")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les versements mensuels",
        variant: "destructive",
      });
      return;
    }

    setMonthlySavings(data || []);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchMonthlySavings();
  }, []);

  const updateSavingsPercentage = async (value: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ savings_goal_percentage: value })
      .eq("id", session.session.user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre objectif d'épargne",
        variant: "destructive",
      });
      return;
    }

    setSavingsPercentage(value);
    toast({
      title: "Succès",
      description: "Votre objectif d'épargne a été mis à jour",
    });
  };

  const addNewMonthlySaving = async () => {
    if (!newSavingName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre versement mensuel",
        variant: "destructive",
      });
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    const { error } = await supabase.from("monthly_savings").insert({
      name: newSavingName,
      amount: newSavingAmount,
      description: newSavingDescription,
      profile_id: session.session.user.id,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le versement mensuel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Versement mensuel ajouté",
    });

    setNewSavingName("");
    setNewSavingAmount(0);
    setNewSavingDescription("");
    fetchMonthlySavings();
  };

  const deleteMonthlySaving = async (id: string) => {
    const { error } = await supabase.from("monthly_savings").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le versement mensuel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Versement mensuel supprimé",
    });

    fetchMonthlySavings();
  };

  const totalMonthlyAmount = monthlySavings.reduce(
    (acc, saving) => acc + saving.amount,
    0
  );

  const targetMonthlySavings = (monthlyIncome * savingsPercentage) / 100;
  const remainingToTarget = targetMonthlySavings - totalMonthlyAmount;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Épargne</h1>
          <p className="text-muted-foreground">
            Gérez vos versements mensuels d'épargne
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
              <CardDescription>
                Définissez le pourcentage de vos revenus à épargner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Revenus mensuels (€)</Label>
                  <Input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    placeholder="Ex: 2000"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Pourcentage d'épargne</Label>
                    <span className="text-sm font-medium">{savingsPercentage}%</span>
                  </div>
                  <Slider
                    value={[savingsPercentage]}
                    onValueChange={(value) => updateSavingsPercentage(value[0])}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
              {monthlyIncome > 0 && (
                <div className="space-y-2 rounded-lg bg-secondary p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Objectif mensuel</span>
                    <span className="font-medium">{targetMonthlySavings.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total épargné</span>
                    <span className="font-medium">{totalMonthlyAmount.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Reste à épargner</span>
                    <span className={`font-medium ${remainingToTarget > 0 ? 'text-destructive' : 'text-green-500'}`}>
                      {remainingToTarget.toFixed(2)}€
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total mensuel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <CardTitle>Total mensuel</CardTitle>
              </div>
              <CardDescription>
                Montant total de vos versements mensuels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold">{totalMonthlyAmount}€</p>
                <p className="text-sm text-muted-foreground mt-2">par mois</p>
              </div>
            </CardContent>
          </Card>

          {/* Ajouter un nouveau versement mensuel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <CardTitle>Nouveau versement mensuel</CardTitle>
              </div>
              <CardDescription>
                Ajoutez un nouveau versement mensuel d'épargne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="saving-name">Nom du versement</Label>
                <Input
                  id="saving-name"
                  value={newSavingName}
                  onChange={(e) => setNewSavingName(e.target.value)}
                  placeholder="Ex: Assurance Vie, PEL..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saving-amount">Montant mensuel (€)</Label>
                <Input
                  id="saving-amount"
                  type="number"
                  value={newSavingAmount}
                  onChange={(e) => setNewSavingAmount(Number(e.target.value))}
                  placeholder="Ex: 200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saving-description">Description (optionnel)</Label>
                <Textarea
                  id="saving-description"
                  value={newSavingDescription}
                  onChange={(e) => setNewSavingDescription(e.target.value)}
                  placeholder="Ex: Versement automatique le 5 du mois..."
                />
              </div>
              <Button onClick={addNewMonthlySaving} className="w-full">
                Ajouter le versement
              </Button>
            </CardContent>
          </Card>

          {/* Liste des versements mensuels */}
          {monthlySavings.map((saving) => (
            <Card key={saving.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <CardTitle>{saving.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMonthlySaving(saving.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Versement mensuel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Montant mensuel:
                  </span>
                  <span className="text-lg font-bold">{saving.amount}€</span>
                </div>
                {saving.description && (
                  <p className="text-sm text-muted-foreground">
                    {saving.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Savings;
