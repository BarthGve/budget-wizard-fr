import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseSavingDialogProps {
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  };
  onOpenChange?: (open: boolean) => void;
  onSavingAdded?: () => void;
}

export const useSavingDialog = ({ 
  saving, 
  onOpenChange, 
  onSavingAdded 
}: UseSavingDialogProps) => {
  // États du formulaire
  const [name, setName] = useState(saving?.name || "");
  const [domain, setDomain] = useState("");
  const [amount, setAmount] = useState(saving?.amount || 0);
  const [description, setDescription] = useState("");

  // Synchroniser l'état avec le prop "saving"
  useEffect(() => {
    if (saving) {
      setName(saving.name);
      setAmount(saving.amount);
      if (saving.logo_url) {
        const match = saving.logo_url.match(/logo\.clearbit\.com\/(.+)/);
        if (match && match[1]) {
          setDomain(match[1]);
        }
      }
    }
  }, [saving]);

  // Gestionnaire de sauvegarde
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
        response = await supabase
          .from("monthly_savings")
          .update(savingData)
          .eq("id", saving.id);
      } else {
        response = await supabase
          .from("monthly_savings")
          .insert(savingData);
      }

      if (response.error) {
        throw response.error;
      }

      toast.success(saving?.id ? "Épargne mise à jour" : "Épargne ajoutée");
      
      if (onSavingAdded) {
        onSavingAdded();
      }
      
      if (onOpenChange) onOpenChange(false);
      setName("");
      setDomain("");
      setAmount(0);
      setDescription("");
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }
  };

  return {
    name,
    setName,
    domain,
    setDomain,
    amount,
    setAmount,
    description,
    setDescription,
    handleSaveSaving,
  };
};
