
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NewSavingFormProps {
  onSavingAdded: () => void;
}

export const NewSavingForm = ({ onSavingAdded }: NewSavingFormProps) => {
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);
  const [newSavingDescription, setNewSavingDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
    onSavingAdded();
  };

  return (
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
  );
};
