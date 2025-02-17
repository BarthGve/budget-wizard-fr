
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface NewSavingDialogProps {
  onSavingAdded: () => void;
}

export const NewSavingDialog = ({ onSavingAdded }: NewSavingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);
  const [newSavingDescription, setNewSavingDescription] = useState("");
  const [domain, setDomain] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const resetForm = () => {
    setNewSavingName("");
    setNewSavingAmount(0);
    setNewSavingDescription("");
    setDomain("");
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

    let logoUrl = '/placeholder.svg';
    if (domain.trim()) {
      // Si un domaine est fourni, on utilise l'API Clearbit
      logoUrl = `https://logo.clearbit.com/${domain.trim()}`;
    }

    const { error } = await supabase.from("monthly_savings").insert({
      name: newSavingName,
      amount: newSavingAmount,
      description: newSavingDescription,
      profile_id: session.session.user.id,
      logo_url: logoUrl,
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

    resetForm();
    setOpen(false);
    onSavingAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover gap-2">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau versement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau versement mensuel</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau versement mensuel d'épargne
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
            <Label htmlFor="domain">Domaine de l'organisme (optionnel)</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Ex: boursorama.com, fortuneo.fr..."
            />
            <p className="text-sm text-muted-foreground">
              Le logo sera automatiquement récupéré à partir du domaine
            </p>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button 
            onClick={addNewMonthlySaving}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
