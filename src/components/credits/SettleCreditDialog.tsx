import { useState, memo, useRef } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Zap, X, CheckIcon, CreditCardIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Credit, ColorScheme } from "./types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface SettleCreditDialogProps {
  credit: Credit;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreditSettled: () => void;
  colorScheme?: ColorScheme;
  trigger?: React.ReactNode;
}

export const SettleCreditDialog = memo(({
  credit,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onCreditSettled,
  colorScheme = "purple",
  trigger
}: SettleCreditDialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [settleDate, setSettleDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isEarlySettlement, setIsEarlySettlement] = useState(false);
  
  // Détecter si nous sommes sur mobile ou tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useIsMobile();

  // Gestion de l'état contrôlé/non contrôlé
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  // Vérifier si le règlement est anticipé en comparant avec la date de fin prévue
  const isBeforeEndDate = credit.date_derniere_mensualite && 
    settleDate < new Date(credit.date_derniere_mensualite);
  
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
      buttonOutline: "border-senary-200 hover:bg-senary-50 text-senary-700 hover:text-senary-800 dark:border-senary-800 dark:hover:bg-senary-950 dark:text-senary-300 dark:hover:text-senary-200",
      lightBg: "from-white via-senary-50/40 to-senary-100/70",
      darkBg: "dark:from-gray-900 dark:via-senary-950/20 dark:to-senary-900/30",
      borderLight: "border-senary-100/70",
      borderDark: "dark:border-senary-800/20",
      separator: "via-senary-200/60 dark:via-senary-800/30",
      calendarButton: "border-senary-200 hover:border-senary-300 dark:border-senary-800 dark:hover:border-senary-700",
      earlySettlement: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
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
      buttonOutline: "border-quaternary-200 hover:bg-quaternary-50 text-quaternary-700 hover:text-quaternary-800 dark:border-quaternary-800 dark:hover:bg-quaternary-950 dark:text-quaternary-300 dark:hover:text-quaternary-200",
      lightBg: "from-white via-quaternary-50/40 to-quaternary-100/70",
      darkBg: "dark:from-gray-900 dark:via-quaternary-950/20 dark:to-quaternary-900/30",
      borderLight: "border-quaternary-100/70",
      borderDark: "dark:border-quaternary-800/20",
      separator: "via-quaternary-200/60 dark:via-quaternary-800/30",
      calendarButton: "border-quaternary-200 hover:border-quaternary-300 dark:border-quaternary-800 dark:hover:border-quaternary-700",
      earlySettlement: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
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
      buttonOutline: "border-tertiary-200 hover:bg-tertiary-50 text-tertiary-700 hover:text-tertiary-800 dark:border-tertiary-800 dark:hover:bg-tertiary-950 dark:text-tertiary-300 dark:hover:text-tertiary-200",
      lightBg: "from-white via-tertiary-50/40 to-tertiary-100/70",
      darkBg: "dark:from-gray-900 dark:via-tertiary-950/20 dark:to-tertiary-900/30", 
      borderLight: "border-tertiary-100/70",
      borderDark: "dark:border-tertiary-800/20",
      separator: "via-tertiary-200/60 dark:via-tertiary-800/30",
      calendarButton: "border-tertiary-200 hover:border-tertiary-300 dark:border-tertiary-800 dark:hover:border-tertiary-700",
      earlySettlement: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
    }
  };

  const currentColors = colors[colorScheme];
  
  // Fonction pour solder le crédit
  const handleSettleCredit = async () => {
    setIsLoading(true);
    try {
      // Déterminer si le règlement est anticipé (soit manuellement indiqué ou par date)
      const effectiveEarlySettlement = isEarlySettlement || isBeforeEndDate;
      
      // Mettre à jour le statut du crédit en "remboursé"
      const { error } = await supabase
        .from("credits")
        .update({
          statut: "remboursé",
          date_derniere_mensualite: settleDate.toISOString().split("T")[0], // Format YYYY-MM-DD
          is_early_settlement: effectiveEarlySettlement, // Enregistrer l'information d'anticipation
        })
        .eq("id", credit.id);

      if (error) throw error;

      // Notification de succès
      toast.success(`Le crédit ${credit.nom_credit} a été soldé avec succès${effectiveEarlySettlement ? ' par anticipation' : ''}`);
      
      // Fermer la boîte de dialogue et rafraîchir la liste
      onOpenChange?.(false);
      onCreditSettled();
    } catch (error) {
      console.error("Erreur lors du solde du crédit:", error);
      toast.error("Une erreur est survenue lors du solde du crédit");
    } finally {
      setIsLoading(false);
    }
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
                  <CheckIcon className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                  Solder le crédit
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <p className={cn("text-base", currentColors.descriptionText)}>
                  Vous êtes sur le point de marquer le crédit "{credit.nom_credit}" comme remboursé.
                  Cette action déplacera le crédit dans la section des archives.
                </p>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              currentColors.separator
            )} />
            
            {/* Section du formulaire */}
            <div className="relative z-10 px-6 space-y-6">
              <div className="space-y-3">
                <h3 className={cn("text-sm font-medium", currentColors.headingText)}>Date de solde</h3>
                <p className={cn("text-sm", currentColors.descriptionText)}>
                  Par défaut, la date d'aujourd'hui sera utilisée comme date de solde.
                  Vous pouvez la modifier si nécessaire.
                </p>
                
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !settleDate && "text-muted-foreground",
                        currentColors.calendarButton
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {settleDate ? (
                        format(settleDate, "dd MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={settleDate}
                      onSelect={(date) => {
                        setSettleDate(date || new Date());
                        setDatePickerOpen(false);
                      }}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Section pour détecter si le crédit est soldé par anticipation */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="earlySettlement-mobile" 
                    checked={isEarlySettlement || isBeforeEndDate}
                    onCheckedChange={(checked) => {
                      // Si la date est avant la fin, on ne peut pas décocher la case
                      if (!isBeforeEndDate || checked) {
                        setIsEarlySettlement(checked === true);
                      }
                    }}
                    disabled={isBeforeEndDate} // Désactiver si la date est déjà anticipée
                  />
                  <label 
                    htmlFor="earlySettlement-mobile" 
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center",
                      currentColors.headingText
                    )}
                  >
                    Solde anticipé
                    {isBeforeEndDate && (
                      <Badge 
                        variant="outline" 
                        className={cn("ml-2", currentColors.earlySettlement)}
                      >
                        <Zap className="h-3 w-3 mr-1" /> Détecté
                      </Badge>
                    )}
                  </label>
                </div>
                <p className={cn("text-xs pl-6", currentColors.descriptionText)}>
                  {isBeforeEndDate 
                    ? `Date de fin prévue: ${format(new Date(credit.date_derniere_mensualite), "dd MMMM yyyy", { locale: fr })}`
                    : "Cochez cette case si vous avez remboursé ce crédit avant son échéance prévue."}
                </p>
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <LoadingButton 
                  onClick={handleSettleCredit}
                  loading={isLoading}
                  className={cn(currentColors.buttonBg, "text-white")}
                >
                  Solder le crédit
                </LoadingButton>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange?.(false)}
                  disabled={isLoading}
                  className={cn(currentColors.buttonOutline)}
                >
                  Annuler
                </Button>
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
          "sm:max-w-[500px] w-full p-0 shadow-lg rounded-lg border",
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
                <CheckIcon className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                Solder le crédit
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <p className={cn("text-base", currentColors.descriptionText)}>
                Vous êtes sur le point de marquer le crédit "{credit.nom_credit}" comme remboursé.
                Cette action déplacera le crédit dans la section des archives.
              </p>
            </div>
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            currentColors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <h3 className={cn("text-sm font-medium", currentColors.headingText)}>Date de solde</h3>
              <p className={cn("text-sm", currentColors.descriptionText)}>
                Par défaut, la date d'aujourd'hui sera utilisée comme date de solde.
                Vous pouvez la modifier si nécessaire.
              </p>
              
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !settleDate && "text-muted-foreground",
                      currentColors.calendarButton
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settleDate ? (
                      format(settleDate, "dd MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={settleDate}
                    onSelect={(date) => {
                      setSettleDate(date || new Date());
                      setDatePickerOpen(false);
                    }}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Section pour détecter si le crédit est soldé par anticipation */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="earlySettlement-desktop" 
                  checked={isEarlySettlement || isBeforeEndDate}
                  onCheckedChange={(checked) => {
                    // Si la date est avant la fin, on ne peut pas décocher la case
                    if (!isBeforeEndDate || checked) {
                      setIsEarlySettlement(checked === true);
                    }
                  }}
                  disabled={isBeforeEndDate} // Désactiver si la date est déjà anticipée
                />
                <label 
                  htmlFor="earlySettlement-desktop" 
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center",
                    currentColors.headingText
                  )}
                >
                  Solde anticipé
                  {isBeforeEndDate && (
                    <Badge 
                      variant="outline" 
                      className={cn("ml-2", currentColors.earlySettlement)}
                    >
                      <Zap className="h-3 w-3 mr-1" /> Détecté
                    </Badge>
                  )}
                </label>
              </div>
              <p className={cn("text-xs pl-6", currentColors.descriptionText)}>
                {isBeforeEndDate 
                  ? `Date de fin prévue: ${format(new Date(credit.date_derniere_mensualite), "dd MMMM yyyy", { locale: fr })}`
                  : "Cochez cette case si vous avez remboursé ce crédit avant son échéance prévue."}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange?.(false)}
                disabled={isLoading}
                className={cn(currentColors.buttonOutline)}
              >
                Annuler
              </Button>
              <LoadingButton 
                onClick={handleSettleCredit}
                loading={isLoading}
                className={cn(currentColors.buttonBg, "text-white")}
              >
                Solder le crédit
              </LoadingButton>
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

SettleCreditDialog.displayName = "SettleCreditDialog";