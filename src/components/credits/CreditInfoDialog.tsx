import { useState, memo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Credit, ColorScheme } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreditCardIcon, Zap, X, InfoIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreditInfoDialogProps {
  credit: Credit;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  colorScheme?: ColorScheme;
  trigger?: React.ReactNode;
}

export const CreditInfoDialog = memo(({ 
  credit, 
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  colorScheme = "purple",
  trigger
}: CreditInfoDialogProps) => {
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
      gradientFrom: "from-senary-500",
      gradientTo: "to-violet-400", 
      darkGradientFrom: "dark:from-senary-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-senary-100 text-senary-700 dark:bg-senary-900/30 dark:text-senary-300",
      headingText: "text-senary-900 dark:text-senary-200",
      descriptionText: "text-senary-700/80 dark:text-senary-300/80",
      buttonBg: "bg-senary-600 hover:bg-senary-500 dark:bg-senary-700 dark:hover:bg-senary-600",
      lightBg: "from-white via-senary-50/40 to-senary-100/70",
      darkBg: "dark:from-gray-900 dark:via-senary-950/20 dark:to-senary-900/30",
      borderLight: "border-senary-100/70",
      borderDark: "dark:border-senary-800/20",
      separator: "via-senary-200/60 dark:via-senary-800/30",
      earlySettlement: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50",
      activeStatus: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      reimbursedStatus: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      defaultStatus: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
      separator: "via-quaternary-200/60 dark:via-quaternary-800/30",
      earlySettlement: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50",
      activeStatus: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      reimbursedStatus: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      defaultStatus: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
      separator: "via-tertiary-200/60 dark:via-tertiary-800/30",
      earlySettlement: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50",
      activeStatus: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", 
      reimbursedStatus: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      defaultStatus: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    }
  };

  const currentColors = colors[colorScheme];

  // Calculer le montant total du crédit
  const calculateTotalAmount = () => {
    if (!credit.date_premiere_mensualite) return credit.montant_mensualite;
    
    const firstDate = new Date(credit.date_premiere_mensualite);
    const lastDate = new Date(credit.date_derniere_mensualite);
    
    // Calculer le nombre de mois entre les dates
    const months = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                  (lastDate.getMonth() - firstDate.getMonth()) + 1;
    
    return months * credit.montant_mensualite;
  };

  // Afficher Sheet sur mobile, Dialog sur desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger}
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
                  <InfoIcon className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold flex items-center gap-2", currentColors.headingText)}>
                  <span>Détails du crédit</span>
                  {credit.statut === "remboursé" && credit.is_early_settlement && (
                    <Badge variant="outline" className={cn(currentColors.earlySettlement)}>
                      <Zap className="h-3 w-3 mr-1" /> Soldé par anticipation
                    </Badge>
                  )}
                </DialogTitle>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              currentColors.separator
            )} />
            
            {/* Contenu des informations */}
            <div className="relative z-10 px-6 grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Nom</h3>
                  <p className={cn("text-base font-medium", currentColors.headingText)}>{credit.nom_credit}</p>
                </div>
                <div>
                  <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Domaine</h3>
                  <p className={cn("text-base font-medium", currentColors.headingText)}>{credit.nom_domaine}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Mensualité</h3>
                  <p className={cn("text-base font-medium", currentColors.headingText)}>{credit.montant_mensualite.toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Montant total</h3>
                  <p className={cn("text-base font-medium", currentColors.headingText)}>{calculateTotalAmount().toLocaleString('fr-FR')} €</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Première mensualité</h3>
                  <p className={cn("text-base", currentColors.headingText)}>
                    {credit.date_premiere_mensualite 
                      ? format(new Date(credit.date_premiere_mensualite), 'dd MMMM yyyy', { locale: fr })
                      : "Non spécifiée"}
                  </p>
                </div>
                <div>
                  <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>
                    {credit.statut === "remboursé" && credit.is_early_settlement 
                      ? "Date de solde anticipé" 
                      : "Dernière mensualité"}
                  </h3>
                  <p className={cn(
                    "text-base",
                    currentColors.headingText,
                    credit.statut === "remboursé" && credit.is_early_settlement && "font-medium text-amber-600 dark:text-amber-400"
                  )}>
                    {format(new Date(credit.date_derniere_mensualite), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Statut</h3>
                <div className={cn(
                  "inline-block px-2 py-1 rounded-full text-sm",
                  credit.statut === "actif" 
                    ? currentColors.activeStatus
                    : credit.statut === "remboursé"
                      ? currentColors.reimbursedStatus
                      : currentColors.defaultStatus
                )}>
                  {credit.statut.charAt(0).toUpperCase() + credit.statut.slice(1)}
                </div>
              </div>
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
      {trigger}
      <DialogContent 
        className={cn(
          "sm:max-w-[550px] w-full p-0 shadow-lg rounded-lg border",
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
                <InfoIcon className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold flex items-center gap-2", currentColors.headingText)}>
                <span>Détails du crédit</span>
                {credit.statut === "remboursé" && credit.is_early_settlement && (
                  <Badge variant="outline" className={cn(currentColors.earlySettlement)}>
                    <Zap className="h-3 w-3 mr-1" /> Soldé par anticipation
                  </Badge>
                )}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            currentColors.separator
          )} />
          
          {/* Contenu des informations */}
          <div className="relative z-10 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Nom</h3>
                <p className={cn("text-base font-medium", currentColors.headingText)}>{credit.nom_credit}</p>
              </div>
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Domaine</h3>
                <p className={cn("text-base font-medium", currentColors.headingText)}>{credit.nom_domaine}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Mensualité</h3>
                <p className={cn("text-base font-medium", currentColors.headingText)}>{credit.montant_mensualite.toLocaleString('fr-FR')} €</p>
              </div>
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Montant total</h3>
                <p className={cn("text-base font-medium", currentColors.headingText)}>{calculateTotalAmount().toLocaleString('fr-FR')} €</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Première mensualité</h3>
                <p className={cn("text-base", currentColors.headingText)}>
                  {credit.date_premiere_mensualite 
                    ? format(new Date(credit.date_premiere_mensualite), 'dd MMMM yyyy', { locale: fr })
                    : "Non spécifiée"}
                </p>
              </div>
              <div>
                <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>
                  {credit.statut === "remboursé" && credit.is_early_settlement 
                    ? "Date de solde anticipé" 
                    : "Dernière mensualité"}
                </h3>
                <p className={cn(
                  "text-base",
                  currentColors.headingText,
                  credit.statut === "remboursé" && credit.is_early_settlement && "font-medium text-amber-600 dark:text-amber-400"
                )}>
                  {format(new Date(credit.date_derniere_mensualite), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className={cn("text-sm font-medium mb-1", currentColors.descriptionText)}>Statut</h3>
              <div className={cn(
                "inline-block px-2 py-1 rounded-full text-sm",
                credit.statut === "actif" 
                  ? currentColors.activeStatus
                  : credit.statut === "remboursé"
                    ? currentColors.reimbursedStatus
                    : currentColors.defaultStatus
              )}>
                {credit.statut.charAt(0).toUpperCase() + credit.statut.slice(1)}
              </div>
            </div>
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
    prevProps.credit?.id === nextProps.credit?.id;
});

CreditInfoDialog.displayName = "CreditInfoDialog";