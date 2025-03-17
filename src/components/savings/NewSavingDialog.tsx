import { useState, useEffect, memo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { SavingForm } from "./SavingForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PiggyBank, EditIcon, PlusCircleIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "next-themes";

interface NewSavingDialogProps {
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  colorScheme?: "green" | "blue" | "purple";
  onSavingAdded?: () => void;
}

export const NewSavingDialog = memo(({
  saving,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  colorScheme = "green",
  onSavingAdded,
}: NewSavingDialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Responsive détection pour les tablettes
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  // Gestion de l'état contrôlé/non contrôlé
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  // Couleurs dynamiques selon le colorScheme
  const colors = {
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-green-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-200",
      descriptionText: "text-green-700/80 dark:text-green-300/80",
      buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
      lightBg: "from-white via-green-50/40 to-green-100/70",
      darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
      borderLight: "border-green-100/70",
      borderDark: "dark:border-green-800/20",
    },
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      darkGradientFrom: "dark:from-blue-600",
      darkGradientTo: "dark:to-sky-500",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-200",
      descriptionText: "text-blue-700/80 dark:text-blue-300/80",
      buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
      lightBg: "from-white via-blue-50/40 to-blue-100/70",
      darkBg: "dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30",
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20",
    },
    purple: {
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-400",
      darkGradientFrom: "dark:from-purple-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      headingText: "text-purple-900 dark:text-purple-200",
      descriptionText: "text-purple-700/80 dark:text-purple-300/80",
      buttonBg: "bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600",
      lightBg: "from-white via-purple-50/40 to-purple-100/70",
      darkBg: "dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30",
      borderLight: "border-purple-100/70", 
      borderDark: "dark:border-purple-800/20",
    },
  };
  const currentColors = colors[colorScheme];

  // Form states
  const [name, setName] = useState(saving?.name || "");
  const [domain, setDomain] = useState("");
  const [amount, setAmount] = useState(saving?.amount || 0);
  const [description, setDescription] = useState("");

  // Sync state with provided "saving" prop
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

  // Save handler
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto",
          currentColors.borderLight,
          currentColors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <div 
          ref={contentRef}
          className={cn(
            "relative flex flex-col pb-6 p-6 rounded-lg",
            "bg-gradient-to-br",
            currentColors.lightBg,
            currentColors.darkBg
          )}
        >
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
            currentColors.gradientFrom,
            currentColors.gradientTo,
            currentColors.darkGradientFrom,
            currentColors.darkGradientTo
          )} />

          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          <DialogHeader className="relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
                {saving ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
              </div>
              <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                {saving ? "Modifier un versement" : "Ajouter un versement"}
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
                {saving
                  ? "Modifiez les informations de votre versement d'épargne."
                  : "Ajoutez un nouveau versement mensuel facilement."}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="relative z-10 px-1">
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

            <div className="flex justify-end mt-5 gap-3">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange?.(false)}
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveSaving}
                className={cn(
                  "text-white px-6 py-2 rounded-lg",
                  currentColors.buttonBg
                )}
              >
                {saving ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <PiggyBank className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}, (prevProps, nextProps) => {
  return prevProps.open === nextProps.open &&
    prevProps.saving?.id === nextProps.saving?.id &&
    prevProps.colorScheme === nextProps.colorScheme &&
    prevProps.trigger === nextProps.trigger &&
    prevProps.onSavingAdded === nextProps.onSavingAdded;
});

NewSavingDialog.displayName = "NewSavingDialog";
