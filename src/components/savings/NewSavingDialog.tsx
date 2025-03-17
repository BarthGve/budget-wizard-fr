
import { memo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NewSavingDialogContent } from "./NewSavingDialogContent";
import { useSavingDialog } from "./hooks/useSavingDialog";

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
  
  // Responsive détection pour les tablettes
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <DialogContent 
        className={cn(
          "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto",
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
