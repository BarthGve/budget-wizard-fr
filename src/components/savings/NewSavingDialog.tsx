
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SavingForm } from "./SavingForm";
import { useLogoPreview } from "./hooks/useLogoPreview";

interface NewSavingDialogProps {
  onSavingAdded: () => void;
  trigger?: React.ReactNode;
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewSavingDialog = ({ onSavingAdded, trigger, saving, open: controlledOpen, onOpenChange }: NewSavingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);
  const [newSavingDescription, setNewSavingDescription] = useState("");
  const [domain, setDomain] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { previewLogoUrl, isLogoValid, getFaviconUrl } = useLogoPreview(domain);

  useEffect(() => {
    if (saving) {
      setNewSavingName(saving.name);
      setNewSavingAmount(saving.amount);
      if (saving.logo_url && saving.logo_url !== "/placeholder.svg") {
        setDomain(saving.logo_url.replace("https://logo.clearbit.com/", ""));
      }
    }
  }, [saving]);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

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
    if (domain.trim() && isLogoValid && previewLogoUrl) {
      logoUrl = previewLogoUrl;
    }

    const savingData = {
      name: newSavingName,
      amount: newSavingAmount,
      description: newSavingDescription,
      profile_id: session.session.user.id,
      logo_url: logoUrl,
    };

    if (saving) {
      const { error } = await supabase
        .from("monthly_savings")
        .update(savingData)
        .eq("id", saving.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le versement mensuel",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Versement mensuel modifié",
      });
    } else {
      const { error } = await supabase
        .from("monthly_savings")
        .insert(savingData);

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
    }

    resetForm();
    handleOpenChange(false);
    onSavingAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!controlledOpen && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{saving ? "Modifier le versement mensuel" : "Nouveau versement mensuel"}</DialogTitle>
          <DialogDescription>
            {saving ? "Modifiez les informations de votre versement mensuel" : "Ajoutez un nouveau versement mensuel d'épargne"}
          </DialogDescription>
        </DialogHeader>
        <SavingForm
          name={newSavingName}
          onNameChange={setNewSavingName}
          domain={domain}
          onDomainChange={setDomain}
          amount={newSavingAmount}
          onAmountChange={setNewSavingAmount}
          description={newSavingDescription}
          onDescriptionChange={setNewSavingDescription}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={addNewMonthlySaving}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            {saving ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
