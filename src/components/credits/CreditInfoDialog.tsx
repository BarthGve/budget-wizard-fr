import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Credit } from "./types";
import { format, differenceInMonths, isAfter, isSameDay, addMonths, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { CreditProgressBar } from "./CreditProgressBar";
import { cn } from "@/lib/utils";
import { CalendarIcon, CreditCardIcon, PiggyBankIcon, CarIcon, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useVehicle } from "@/hooks/queries/useVehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogClose } from "@radix-ui/react-dialog";

interface CreditInfoDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditInfoDialog = ({ credit, open, onOpenChange }: CreditInfoDialogProps) => {
  const { data: vehicle } = useVehicle(credit.vehicle_id || "", {
    enabled: !!credit.vehicle_id && open
  });
  
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useIsMobile();
  
  const startDate = new Date(credit.date_premiere_mensualite);
  const endDate = new Date(credit.date_derniere_mensualite);
  const currentDate = new Date();
  
  const totalMonths = differenceInMonths(endDate, startDate) + 1;
  let completedMonths = 0;
  
  if (isBefore(currentDate, startDate)) {
    completedMonths = 0;
  } else {
    let paymentDate = new Date(startDate);
    
    while (isBefore(paymentDate, currentDate) || isSameDay(paymentDate, currentDate)) {
      completedMonths++;
      
      if (isSameDay(paymentDate, endDate)) {
        break;
      }
      
      paymentDate = addMonths(paymentDate, 1);
    }
  }
  
  completedMonths = Math.min(completedMonths, totalMonths);
  
  const progressPercentage = Math.min(100, Math.max(0, (completedMonths / totalMonths) * 100));
  
  const montantTotal = totalMonths * credit.montant_mensualite;
  const montantRembourse = completedMonths * credit.montant_mensualite;
  const montantRestant = montantTotal - montantRembourse;

  // Utilisation de la couleur "primary" uniquement
  const primaryColor = {
    gradientFrom: "from-primary-500",
    gradientTo: "to-primary-400",
    iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300",
    headingText: "text-primary-900 dark:text-primary-200",
    descriptionText: "text-primary-700/80 dark:text-primary-300/80",
    cardBg: "bg-primary-50/50 dark:bg-primary-900/20",
    lightBg: "from-white via-primary-50/40 to-primary-100/70",
    darkBg: "dark:from-gray-900 dark:via-primary-950/20 dark:to-primary-900/30",
    titleText: "text-primary-900 dark:text-primary-200",
    border: "border-primary-200 dark:border-primary-800/40",
    separator: "via-primary-200/60 dark:via-primary-800/30"
  };

  // Fonction pour récupérer le label du type de dépense
  const getExpenseTypeLabel = () => {
    if (!credit.vehicle_expense_type) return null;
    const expenseType = credit.vehicle_expense_type;
    switch (expenseType) {
      case "carburant": return "Carburant";
      case "entretien": return "Entretien";
      case "reparation": return "Réparation";
      case "assurance": return "Assurance";
      case "parking": return "Parking";
      case "peage": return "Péage";
      case "financement": return "Financement";
      case "autre": return "Autre";
      default: return expenseType;
    }
  };

  // Contenu commun aux versions mobile et desktop
  const renderContent = () => (
    <div 
      className={cn(
        "relative flex flex-col pb-6 pt-5",
        "bg-gradient-to-br",
        primaryColor.lightBg,
        primaryColor.darkBg
      )}
    >
      {/* Gradient de fond */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
        primaryColor.gradientFrom,
        primaryColor.gradientTo
      )} />
      
      {/* Header du dialog */}
      <DialogHeader className="relative z-10 mb-4 px-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", primaryColor.iconBg)}>
            <CreditCardIcon className="w-5 h-5" />
          </div>
          <DialogTitle className={cn("text-2xl font-bold", primaryColor.headingText)}>
            {credit.nom_credit}
          </DialogTitle>
        </div>
        <div className="ml-[52px] mt-2">
          <p className={cn("text-base", primaryColor.descriptionText)}>
            {credit.nom_domaine}
          </p>
        </div>
      </DialogHeader>
      
      {/* Séparateur */}
      <div className={cn(
        "h-px w-full mb-6",
        "bg-gradient-to-r from-transparent to-transparent",
        primaryColor.separator
      )} />
      
      {/* Contenu du dialog */}
      <div className="space-y-6 py-4 relative z-10 px-6">
        {/* Informations sur le crédit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {credit.logo_url ? (
              <div className={cn(
                "w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center",
                "shadow-sm",
                "bg-white dark:bg-gray-800"
              )}>
                <img
                  src={credit.logo_url}
                  alt={credit.nom_credit}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            ) : (
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                primaryColor.iconBg
              )}>
                <CreditCardIcon className="w-7 h-7" />
              </div>
            )}
            
            <div>
              <h4 className="font-semibold text-lg">{credit.nom_domaine}</h4>
              <p className="text-muted-foreground">
                Mensualité de <span className="font-medium">{formatCurrency(credit.montant_mensualite)}</span>
              </p>
            </div>
          </div>
          
          <div className={cn(
            "rounded-full px-4 py-2 text-sm font-medium",
            "shadow-sm",
            primaryColor.iconBg
          )}>
            {formatCurrency(montantTotal)}
          </div>
        </div>

        <div className={cn(
          "rounded-xl p-4",
          primaryColor.cardBg
        )}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className={cn(
                "p-2 rounded-lg mt-0.5",
                primaryColor.iconBg
              )}>
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Première échéance</p>
                <p className="font-medium">
                  {format(new Date(credit.date_premiere_mensualite), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className={cn(
                "p-2 rounded-lg mt-0.5",
                primaryColor.iconBg
              )}>
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière échéance</p>
                <p className="font-medium">
                  {format(new Date(credit.date_derniere_mensualite), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progression du remboursement */}
        <div className="space-y-4">
          <h3 className="font-medium text-base">Progression du remboursement</h3>
          
          <CreditProgressBar 
            dateDebut={credit.date_premiere_mensualite} 
            dateFin={credit.date_derniere_mensualite} 
            montantMensuel={credit.montant_mensualite} 
            withTooltip={false}
          />
          
          <div className={cn(
            "rounded-xl p-4",
            primaryColor.cardBg
          )}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                primaryColor.iconBg
              )}>
                <PiggyBankIcon className="w-4 h-4" />
              </div>
              <h4 className="font-medium">Détails du remboursement</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Montant total du crédit</p>
                <p className="font-medium">{formatCurrency(montantTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant remboursé à ce jour</p>
                <p className="font-medium">{formatCurrency(montantRembourse)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant restant</p>
                <p className="font-medium">{formatCurrency(montantRestant)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensualité restante</p>
                <p className="font-medium">{formatCurrency(credit.montant_mensualite)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-3xl">
      {isMobile || isTablet ? (
        <DialogContent>
          {renderContent()}
        </DialogContent>
      ) : (
        <Sheet>
          <SheetContent className="max-w-[680px] p-4 sm:p-6 sm:py-8 sm:rounded-lg">
            {renderContent()}
          </SheetContent>
        </Sheet>
      )}
      <DialogClose>
        <X className="w-5 h-5 text-primary-700 dark:text-primary-300" />
      </DialogClose>
    </Dialog>
  );
};