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
  onSavingAdded?: () => void;
}

export const NewSavingDialog = memo(({
  saving,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
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
            "border-quaternary-100/70",
            "dark:border-quaternary-800/20",
            "max-h-[90vh] overflow-y-auto",
            "dark:bg-gray-900",
            "bg-gradient-to-br",
            "from-quaternary-50",
            "to-quaternary-100",
            "dark:from-quaternary-950",
            "dark:to-quaternary-900"
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
              colorScheme="quaternary"
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
          "border-quaternary-100/70",
          "dark:border-quaternary-800/20",
          "bg-gradient-to-br",
          "from-quaternary-50",
          "to-quaternary-100",
          "dark:from-quaternary-950",
          "dark:to-quaternary-900"
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
          colorScheme="quaternary"
        />
      </DialogContent>
    </Dialog>
  );
}, (prevProps, nextProps) => {
  return prevProps.open === nextProps.open &&
    prevProps.saving?.id === nextProps.saving?.id &&
    prevProps.trigger === nextProps.trigger &&
    prevProps.onSavingAdded === nextProps.onSavingAdded;
});

NewSavingDialog.displayName = "NewSavingDialog";