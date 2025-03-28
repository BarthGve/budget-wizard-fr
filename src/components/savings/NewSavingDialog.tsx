
import { memo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NewSavingDialogContent } from "./NewSavingDialogContent";
import { useSavingDialog } from "./hooks/useSavingDialog";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  // Utilisons les deux approches pour une meilleure détection des appareils
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useIsMobile();

  // Gestion de l'état contrôlé/non contrôlé
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  // Utilisation du hook personnalisé pour la logique du formulaire
  const {
    name,
    setName,
    domain,
    setDomain,
    amount,
    setAmount,
    description,
    setDescription,
    handleSaveSaving,
  } = useSavingDialog({ 
    saving, 
    onOpenChange,
    onSavingAdded 
  });

  // Couleurs dynamiques selon le colorScheme
  const colors = {
    green: {
      borderLight: "border-green-100/70",
      borderDark: "dark:border-green-800/20",
      bgGradient: "from-white via-green-50/40 to-green-100/70 dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30"
    },
    blue: {
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20",
      bgGradient: "from-white via-blue-50/40 to-blue-100/70 dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30"
    },
    purple: {
      borderLight: "border-purple-100/70", 
      borderDark: "dark:border-purple-800/20",
      bgGradient: "from-white via-purple-50/40 to-purple-100/70 dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30"
    },
  };
  const currentColors = colors[colorScheme];

  // Contenu partagé pour le Dialog et le Sheet
  const dialogContent = (
    <NewSavingDialogContent
      saving={saving}
      name={name}
      onNameChange={setName}
      domain={domain}
      onDomainChange={setDomain}
      amount={amount}
      onAmountChange={setAmount}
      description={description}
      onDescriptionChange={setDescription}
      onSave={handleSaveSaving}
      onCancel={() => onOpenChange?.(false)}
      colorScheme={colorScheme}
    />
  );

  // Si on est sur mobile, utiliser Sheet au lieu de Dialog
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent 
          side="bottom" 
          className={cn(
            "p-0 shadow-lg rounded-t-lg border overflow-y-auto h-[90vh]",
            currentColors.borderLight,
            currentColors.borderDark,
            "bg-gradient-to-br",
            currentColors.bgGradient
          )}
        >
          {dialogContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Pour tablette et desktop, on utilise Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          isTablet ? "w-[85%] max-w-[85%]" : "sm:max-w-[650px] w-full",
          "p-0 shadow-lg rounded-lg border overflow-y-auto",
          currentColors.borderLight,
          currentColors.borderDark,
          "bg-gradient-to-br",
          currentColors.bgGradient
        )}
      >
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
});

NewSavingDialog.displayName = "NewSavingDialog";
