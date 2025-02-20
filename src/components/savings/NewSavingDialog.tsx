
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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

const getFaviconUrl = (domain: string) => {
  if (!domain) return null;
  const cleanDomain = domain.trim().toLowerCase();
  // Ajout du protocole si non présent pour éviter les erreurs CORS
  if (!cleanDomain.startsWith('http')) {
    return `https://logo.clearbit.com/${cleanDomain}`;
  }
  const url = new URL(cleanDomain);
  return `https://logo.clearbit.com/${url.hostname}`;
};

export const NewSavingDialog = ({ onSavingAdded, trigger, saving, open: controlledOpen, onOpenChange }: NewSavingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);
  const [newSavingDescription, setNewSavingDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isLogoValid, setIsLogoValid] = useState(true);
  const [isCheckingLogo, setIsCheckingLogo] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (saving) {
      setNewSavingName(saving.name);
      setNewSavingAmount(saving.amount);
      if (saving.logo_url && saving.logo_url !== "/placeholder.svg") {
        setDomain(saving.logo_url.replace("https://logo.clearbit.com/", ""));
      }
    }
  }, [saving]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkLogo = async () => {
      if (!domain?.trim()) {
        setPreviewLogoUrl(null);
        setIsLogoValid(true);
        setIsCheckingLogo(false);
        return;
      }

      try {
        setIsCheckingLogo(true);
        const logoUrl = getFaviconUrl(domain);
        
        if (!logoUrl) {
          setPreviewLogoUrl(null);
          setIsLogoValid(false);
          return;
        }

        setPreviewLogoUrl(logoUrl);

        // Créer une promesse pour charger l'image
        const loadImage = () => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = logoUrl;
          });
        };

        await loadImage();
        setIsLogoValid(true);
      } catch (error) {
        console.error("Error loading logo:", error);
        setIsLogoValid(false);
      } finally {
        setIsCheckingLogo(false);
      }
    };

    timeoutId = setTimeout(checkLogo, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [domain]);

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
    setPreviewLogoUrl(null);
    setIsLogoValid(true);
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
            <div className="flex items-center gap-4">
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ex: boursorama.com, fortuneo.fr..."
              />
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white overflow-hidden">
                {isCheckingLogo ? (
                  <div className="text-xs text-muted-foreground text-center">
                    Chargement...
                  </div>
                ) : previewLogoUrl && isLogoValid ? (
                  <img
                    src={previewLogoUrl}
                    alt="Logo preview"
                    className="w-8 h-8 object-contain"
                  />
                ) : domain ? (
                  <div className="text-xs text-muted-foreground text-center">
                    Logo non trouvé
                  </div>
                ) : null}
              </div>
            </div>
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
