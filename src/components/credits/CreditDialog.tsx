
import { useState, memo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { CreditForm } from "./CreditForm";
import { Credit } from "./types";
import { cn } from "@/lib/utils";
import { CreditCardIcon, EditIcon, PlusCircleIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface CreditDialogProps {
  credit?: Credit;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  colorScheme?: "purple" | "green" | "blue";
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

  // Détecter si nous sommes sur tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  // Sélection des couleurs en fonction du scheme choisi
  const colors = {
    purple: {
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-400", 
      darkGradientFrom: "dark:from-purple-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
      headingText: "text-purple-900 dark:text-purple-200",
      descriptionText: "text-purple-700/80 dark:text-purple-300/80"
    },
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-green-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-200",
      descriptionText: "text-green-700/80 dark:text-green-300/80"
    },
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      darkGradientFrom: "dark:from-blue-600",
      darkGradientTo: "dark:to-sky-500",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-200",
      descriptionText: "text-blue-700/80 dark:text-blue-300/80"
    }
  };

  const currentColors = colors[colorScheme];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
            currentColors.gradientFrom,
            currentColors.gradientTo,
            currentColors.darkGradientFrom,
            currentColors.darkGradientTo
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
                currentColors.iconBg
              )}>
                {credit ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
              </div>
              <DialogTitle className={cn(
                "text-2xl font-bold",
                currentColors.headingText
              )}>
                {credit ? "Modifier le crédit" : "Ajouter un crédit"}
              </DialogTitle>
            </div>
            
            <div className="ml-[52px]"> {/* Aligné avec l'icône + le texte du titre */}
              <DialogDescription className={cn(
                "mt-1.5 text-base",
                currentColors.descriptionText
              )}>
                {credit 
                  ? "Modifiez les informations de votre crédit. Les modifications seront appliquées immédiatement."
                  : "Ajoutez un nouveau crédit en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
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
          <div className="relative z-10 max-w-full overflow-x-hidden">
            <CreditForm
              credit={credit}
              onSuccess={() => onOpenChange?.(false)}
              onCancel={() => onOpenChange?.(false)}
              colorScheme={colorScheme}
            />
          </div>
          
          {/* Décoration graphique dans le coin inférieur droit */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] z-0">
            <CreditCardIcon className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}, (prevProps, nextProps) => {
  // Optimisation: Vérifiez uniquement les propriétés qui affectent le rendu
  if (prevProps.open !== nextProps.open) return false;
  if ((!prevProps.credit && nextProps.credit) || (prevProps.credit && !nextProps.credit)) return false;
  if (prevProps.credit && nextProps.credit && prevProps.credit.id !== nextProps.credit.id) return false;
  if (prevProps.colorScheme !== nextProps.colorScheme) return false;
  
  // Les children du trigger sont difficiles à comparer, donc si le trigger change, on re-render pour être sûr
  if (prevProps.trigger !== nextProps.trigger) return false;
  
  return true;
});

CreditDialog.displayName = "CreditDialog";
