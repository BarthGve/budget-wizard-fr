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

interface CreditInfoDialogProps {
  credit: Credit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorScheme?: "purple" | "green" | "blue";
}

export const CreditInfoDialog = ({ 
  credit, 
  open, 
  onOpenChange, 
  colorScheme = "purple" 
}: CreditInfoDialogProps) => {
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

  const colors = {
    purple: {
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-400",
      darkGradientFrom: "dark:from-purple-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
      cardBg: "bg-purple-50/50 dark:bg-purple-900/20",
      titleText: "text-purple-900 dark:text-purple-200",
      border: "border-purple-200 dark:border-purple-800/40"
    },
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-green-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
      cardBg: "bg-green-50/50 dark:bg-green-900/20",
      titleText: "text-green-900 dark:text-green-200",
      border: "border-green-200 dark:border-green-800/40"
    },
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      darkGradientFrom: "dark:from-blue-600",
      darkGradientTo: "dark:to-sky-500", 
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
      cardBg: "bg-blue-50/50 dark:bg-blue-900/20",
      titleText: "text-blue-900 dark:text-blue-200",
      border: "border-blue-200 dark:border-blue-800/40"
    }
  };
  
  const currentColors = colors[colorScheme];

  const getExpenseTypeLabel = () => {
    if (!credit.vehicle_expense_type) return null;
    
    const expenseType = credit.vehicle_expense_type;
    switch (expenseType) {
      case "carburant":
        return "Carburant";
      case "entretien":
        return "Entretien";
      case "reparation":
        return "Réparation";
      case "assurance":
        return "Assurance";
      case "parking":
        return "Parking";
      case "peage":
        return "Péage";
      case "financement":
        return "Financement";
      case "autre":
        return "Autre";
      default:
        return expenseType;
    }
  };

  const renderContent = () => (
    <>
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-br",
        currentColors.gradientFrom,
        currentColors.gradientTo,
        currentColors.darkGradientFrom,
        currentColors.darkGradientTo
      )} />
      
      <DialogHeader className="relative z-10">
        <DialogTitle className={cn(
          "text-2xl font-bold flex items-center gap-2 mt-4",
          currentColors.titleText
        )}>
          {credit.nom_credit}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 py-4 relative z-10">
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
                currentColors.iconBg
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
            currentColors.iconBg
          )}>
            {formatCurrency(montantTotal)}
          </div>
        </div>

        <div className={cn(
          "rounded-xl p-4 bg-purple-50/70 dark:bg-purple-900/30",
          isMobile ? "" : currentColors.border
        )}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className={cn(
                "p-2 rounded-lg mt-0.5",
                currentColors.iconBg
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
                currentColors.iconBg
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

        <div className="space-y-4">
          <h3 className="font-medium text-base">Progression du remboursement</h3>
          
          <CreditProgressBar 
            dateDebut={credit.date_premiere_mensualite} 
            dateFin={credit.date_derniere_mensualite} 
            montantMensuel={credit.montant_mensualite} 
            withTooltip={false}
            colorScheme={colorScheme}
          />
          
          <div className={cn(
            "rounded-xl p-4 bg-purple-50/70 dark:bg-purple-900/30",
            isMobile ? "" : currentColors.border
          )}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                currentColors.iconBg
              )}>
                <PiggyBankIcon className="w-4 h-4" />
              </div>
              <h4 className="font-medium">Détails du remboursement</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Mensualités payées</p>
                <p className="font-medium">{completedMonths} sur {totalMonths}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progression</p>
                <p className="font-medium">{progressPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant remboursé</p>
                <p className="font-medium">{formatCurrency(montantRembourse)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant restant</p>
                <p className="font-medium">{formatCurrency(montantRestant)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {credit.vehicle_id && vehicle && (
          <div className={cn(
            "rounded-xl p-4 bg-purple-50/70 dark:bg-purple-900/30",
            isMobile ? "" : currentColors.border
          )}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                currentColors.iconBg
              )}>
                <CarIcon className="w-4 h-4" />
              </div>
              <h4 className="font-medium">Véhicule associé</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Véhicule</p>
                <p className="font-medium">{vehicle.brand} {vehicle.model || ''} ({vehicle.registration_number})</p>
              </div>
              
              {credit.vehicle_expense_type && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Type de dépense</p>
                  <p className="font-medium">{getExpenseTypeLabel()}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Génération automatique</p>
                <p className="font-medium">
                  {credit.auto_generate_vehicle_expense ? "Activée" : "Désactivée"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "rounded-t-xl",
            "shadow-lg",
            "max-h-[90vh] overflow-y-auto",
            "bg-purple-300 dark:bg-gray-900",
            "pb-safe",
            "p-4"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />
          
          <div className="relative">
            {renderContent()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[550px] overflow-hidden",
        isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto"
      )}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
