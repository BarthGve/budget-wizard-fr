
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SavingForm } from "./SavingForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewSavingDialogProps {
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  };
  onSavingAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewSavingDialog = ({
  saving,
  onSavingAdded,
  open = false,
  onOpenChange,
}: NewSavingDialogProps) => {
  // États pour gérer les champs du formulaire
  const [name, setName] = useState(saving?.name || "");
  const [domain, setDomain] = useState("");
  const [amount, setAmount] = useState(saving?.amount || 0);
  const [description, setDescription] = useState("");

  // Mettre à jour les états quand saving change
  useEffect(() => {
    if (saving) {
      setName(saving.name);
      setAmount(saving.amount);
      // Extraction du domaine à partir de l'URL du logo
      if (saving.logo_url) {
        const match = saving.logo_url.match(/logo\.clearbit\.com\/(.+)/);
        if (match && match[1]) {
          setDomain(match[1]);
        }
      }
    }
  }, [saving]);

  // Fonction pour sauvegarder l'épargne
  const handleSaveSaving = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Utilisateur non connecté");
        return;
      }

      const savingData = {
        name,
        amount,
        logo_url: domain ? `https://logo.clearbit.com/${domain}` : null,
        description,
        profile_id: user.id,
      };

      let response;
      if (saving?.id) {
        // Mise à jour d'une épargne existante
        response = await supabase
          .from("monthly_savings")
          .update(savingData)
          .eq("id", saving.id);
      } else {
        // Création d'une nouvelle épargne
        response = await supabase
          .from("monthly_savings")
          .insert(savingData);
      }

      if (response.error) throw response.error;

      toast.success(saving?.id ? "Épargne mise à jour" : "Épargne ajoutée");
      
      if (onSavingAdded) onSavingAdded();
      if (onOpenChange) onOpenChange(false);
      
      // Réinitialiser le formulaire
      setName("");
      setDomain("");
      setAmount(0);
      setDescription("");
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{saving ? 'Modifier' : 'Ajouter'} un versement d'épargne</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <SavingForm
            name={name}
            onNameChange={setName}
            domain={domain}
            onDomainChange={setDomain}
            amount={amount}
            onAmountChange={setAmount}
            description={description}
            onDescriptionChange={setDescription}
          />
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => onOpenChange && onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
