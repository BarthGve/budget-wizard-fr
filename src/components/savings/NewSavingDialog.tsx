
import { memo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  
  // Utilisation de useIsMobile pour détecter si nous sommes sur mobile
  const isMobile = useIsMobile();
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
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
      darkGradientFrom: "dark:from-green-950",
      darkGradientTo: "dark:to-green-900",
      borderLight: "border-green-100/70",
      borderDark: "dark:border-green-800/20"
    },
    blue: {
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
      darkGradientFrom: "dark:from-blue-950",
      darkGradientTo: "dark:to-blue-900",
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20"
    },
    purple: {
      gradientFrom: "from-purple-50",
      gradientTo: "to-purple-100",
      darkGradientFrom: "dark:from-purple-950",
      darkGradientTo: "dark:to-purple-900",
      borderLight: "border-purple-100/70", 
      borderDark: "dark:border-purple-800/20"
    },
  };
  const currentColors = colors[colorScheme];

  // Ajuster la largeur de la boîte de dialogue en fonction du type d'appareil
  const getDialogWidth = () => {
    if (isTablet) return "w-[85%] max-w-[85%]";
    return "sm:max-w-[650px] w-full";
  };

  // Version mobile avec Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent 
          side="bottom"
          className={cn(
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            currentColors.borderLight,
            currentColors.borderDark,
            "max-h-[90vh] overflow-y-auto",
            "dark:bg-gray-900",
            "bg-gradient-to-br",
            currentColors.gradientFrom,
            currentColors.gradientTo,
            currentColors.darkGradientFrom,
            currentColors.darkGradientTo
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />
          <div className="pt-5">
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
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          getDialogWidth(),
          "p-0 border-0 shadow-lg rounded-lg overflow-hidden",
          currentColors.borderLight,
          currentColors.borderDark,
          "bg-gradient-to-br",
          currentColors.gradientFrom,
          currentColors.gradientTo,
          currentColors.darkGradientFrom,
          currentColors.darkGradientTo
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
