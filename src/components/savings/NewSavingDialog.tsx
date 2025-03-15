
import { useState, useEffect, memo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SavingForm } from "./SavingForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PiggyBank, EditIcon, PlusCircleIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface NewSavingDialogProps {
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    description?: string;
  };
  onSavingAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewSavingDialog = memo(({
  saving,
  onSavingAdded,
  open = false,
  onOpenChange,
}: NewSavingDialogProps) => {
  // États pour gérer les champs du formulaire
  const [name, setName] = useState(saving?.name || "");
  const [domain, setDomain] = useState("");
  const [amount, setAmount] = useState(saving?.amount || 0);
  const [description, setDescription] = useState(saving?.description || "");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Détecter si nous sommes sur tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  // Mettre à jour les états quand saving change
  useEffect(() => {
    if (saving) {
      setName(saving.name);
      setAmount(saving.amount);
      setDescription(saving.description || "");
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
      <DialogContent 
        className={cn(
          "sm:max-w-[650px] overflow-hidden",
          // Adaptations spécifiques pour les tablettes
          isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto"
        )}
      >
        <div 
          ref={contentRef}
          className="flex flex-col overflow-x-hidden max-w-full"
        >
          {/* Background gradient subtil */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br",
            "from-green-500 to-emerald-400",
            "dark:from-green-600 dark:to-emerald-500"
          )} />
          
          {/* Fond radial gradient ultra-subtil */}
          <div className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
            "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]"
          )} />
          
          <DialogHeader className="relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-lg",
                "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
              )}>
                {saving ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
              </div>
              <DialogTitle className={cn(
                "text-2xl font-bold",
                "text-green-900 dark:text-green-200"
              )}>
                {saving ? "Modifier le versement" : "Ajouter un versement"}
              </DialogTitle>
            </div>
            
            <div className="ml-[52px]"> {/* Aligné avec l'icône + le texte du titre */}
              <DialogDescription className={cn(
                "mt-1.5 text-base",
                "text-green-700/80 dark:text-green-300/80"
              )}>
                {saving 
                  ? "Modifiez les informations de votre versement d'épargne. Les modifications seront appliquées immédiatement."
                  : "Ajoutez un nouveau versement mensuel en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
              </DialogDescription>
            </div>
          </DialogHeader>
          
          {/* Séparateur subtil */}
          <div className={cn(
            "w-full h-px mb-5 relative z-10",
            "bg-gradient-to-r from-transparent via-gray-200 to-transparent",
            "dark:via-gray-700"
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10 max-w-full overflow-x-hidden px-1 py-4">
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
            
            <div className="flex justify-end mt-5 space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveSaving} 
                className="bg-green-600 hover:bg-green-500 rounded-lg px-[16px] py-0 my-0 text-white"
              >
                {saving ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </div>
          
          {/* Décoration graphique dans le coin inférieur droit */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] z-0">
            <PiggyBank className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}, (prevProps, nextProps) => {
  // Optimisation: Vérifiez uniquement les propriétés qui affectent le rendu
  if (prevProps.open !== nextProps.open) return false;
  if ((!prevProps.saving && nextProps.saving) || (prevProps.saving && !nextProps.saving)) return false;
  if (prevProps.saving && nextProps.saving && prevProps.saving.id !== nextProps.saving.id) return false;
  
  return true;
});

NewSavingDialog.displayName = "NewSavingDialog";
