
import { useState, memo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreditForm } from "./CreditForm";
import { Credit, ColorScheme } from "./types";
import { cn } from "@/lib/utils";
import { CreditCardIcon, EditIcon, PlusCircleIcon, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreditDialogProps {
  credit?: Credit;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  colorScheme?: ColorScheme;
}

export const CreditDialog = memo(({ 
  credit, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  colorScheme = "purple"
}: CreditDialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Détecter si nous sommes sur mobile ou tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useIsMobile();

  // Gestion de l'état contrôlé/non contrôlé
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  // Couleurs du thème selon le colorScheme
  const colors = {
    purple: {
      gradientFrom: "from-primary-500",
      gradientTo: "to-violet-400", 
      darkGradientFrom: "dark:from-primary-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
      headingText: "text-primary-900 dark:text-primary-200",
      descriptionText: "text-primary-700/80 dark:text-primary-300/80",
      buttonBg: "bg-primary-600 hover:bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600",
      lightBg: "from-white via-primary-50/40 to-primary-100/70",
      darkBg: "dark:from-gray-900 dark:via-primary-950/20 dark:to-primary-900/30",
      borderLight: "border-primary-100/70",
      borderDark: "dark:border-primary-800/20",
      separator: "via-primary-200/60 dark:via-primary-800/30"
    },
    green: {
      gradientFrom: "from-quaternary-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-quaternary-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-quaternary-100 text-quaternary-700 dark:bg-quaternary-900/30 dark:text-quaternary-300",
      headingText: "text-quaternary-900 dark:text-quaternary-200",
      descriptionText: "text-quaternary-700/80 dark:text-quaternary-300/80",
      buttonBg: "bg-quaternary-600 hover:bg-quaternary-500 dark:bg-quaternary-700 dark:hover:bg-quaternary-600",
      lightBg: "from-white via-quaternary-50/40 to-quaternary-100/70",
      darkBg: "dark:from-gray-900 dark:via-quaternary-950/20 dark:to-quaternary-900/30",
      borderLight: "border-quaternary-100/70",
      borderDark: "dark:border-quaternary-800/20",
      separator: "via-quaternary-200/60 dark:via-quaternary-800/30"
    },
    blue: {
      gradientFrom: "from-tertiary-500",
      gradientTo: "to-sky-400",
      darkGradientFrom: "dark:from-tertiary-600",
      darkGradientTo: "dark:to-sky-500",
      iconBg: "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-900/30 dark:text-tertiary-300",
      headingText: "text-tertiary-900 dark:text-tertiary-200",
      descriptionText: "text-tertiary-700/80 dark:text-tertiary-300/80",
      buttonBg: "bg-tertiary-600 hover:bg-tertiary-500 dark:bg-tertiary-700 dark:hover:bg-tertiary-600",
      lightBg: "from-white via-tertiary-50/40 to-tertiary-100/70",
      darkBg: "dark:from-gray-900 dark:via-tertiary-950/20 dark:to-tertiary-900/30", 
      borderLight: "border-tertiary-100/70",
      borderDark: "dark:border-tertiary-800/20",
      separator: "via-tertiary-200/60 dark:via-tertiary-800/30"
    }
  };

  const currentColors = colors[colorScheme];

  // Afficher Sheet sur mobile, Dialog sur desktop
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
            "dark:bg-gray-900"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />

          <div 
            className={cn(
              "relative flex flex-col pb-6 pt-5",
              "bg-gradient-to-br",
              currentColors.lightBg,
              currentColors.darkBg
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
              currentColors.gradientFrom,
              currentColors.gradientTo,
              currentColors.darkGradientFrom,
              currentColors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-t-lg" />
            
            {/* Dialog header */}
            <DialogHeader className="relative z-10 mb-4 px-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
                  {credit ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
                </div>
                <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                  {credit ? "Modifier le crédit" : "Ajouter un crédit"}
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
                  {credit 
                    ? "Modifiez les informations de votre crédit. Les modifications seront appliquées immédiatement."
                    : "Ajoutez un nouveau crédit en remplissant les informations ci-dessous."}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              currentColors.separator
            )} />
            
            {/* Section du formulaire */}
            <div className="relative z-10 px-6">
              <CreditForm
                credit={credit}
                onSuccess={() => onOpenChange?.(false)}
                onCancel={() => onOpenChange?.(false)}
                colorScheme={colorScheme}
              />
            </div>
            
            {/* Decorative icon */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
              <CreditCardIcon className="w-full h-full" />
            </div>
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
          "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[85%] w-[85%]",
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
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
            currentColors.gradientFrom,
            currentColors.gradientTo,
            currentColors.darkGradientFrom,
            currentColors.darkGradientTo
          )} />

          {/* Radial gradient */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          {/* Bouton de fermeture */}
          <DialogClose 
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-20",
              "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {/* Dialog header */}
          <DialogHeader className="relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
                {credit ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
              </div>
              <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                {credit ? "Modifier le crédit" : "Ajouter un crédit"}
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
                {credit 
                  ? "Modifiez les informations de votre crédit. Les modifications seront appliquées immédiatement."
                  : "Ajoutez un nouveau crédit en remplissant les informations ci-dessous."}
              </DialogDescription>
            </div>
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            currentColors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10">
            <CreditForm
              credit={credit}
              onSuccess={() => onOpenChange?.(false)}
              onCancel={() => onOpenChange?.(false)}
              colorScheme={colorScheme}
            />
          </div>
          
          {/* Decorative icon */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <CreditCardIcon className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}, (prevProps, nextProps) => {
  return prevProps.open === nextProps.open &&
    prevProps.colorScheme === nextProps.colorScheme &&
    prevProps.trigger === nextProps.trigger &&
    ((prevProps.credit?.id === nextProps.credit?.id) || (!prevProps.credit && !nextProps.credit));
});

CreditDialog.displayName = "CreditDialog";
