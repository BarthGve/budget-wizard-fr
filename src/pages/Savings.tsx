
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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

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
    fetchMonthlySavings();
  }, []);

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
