
import { memo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
      borderDark: "dark:border-green-800/20"
    },
    blue: {
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20"
    },
    purple: {
      borderLight: "border-purple-100/70", 
      borderDark: "dark:border-purple-800/20"
    },
  };
  const currentColors = colors[colorScheme];

  // Ajuster la largeur de la boîte de dialogue en fonction du type d'appareil
  const getDialogWidth = () => {
    if (isMobile) return "w-[95%] max-w-[95%]";
    if (isTablet) return "w-[85%] max-w-[85%]";
    return "sm:max-w-[650px] w-full";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          getDialogWidth(),
          "p-0 shadow-lg rounded-lg border overflow-y-auto",
          currentColors.borderLight,
          currentColors.borderDark,
          "dark:bg-gray-900"
        )}
      >
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
