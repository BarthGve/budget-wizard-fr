import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecurringExpense, periodicityLabels } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Calendar, CreditCard, Tag, RefreshCcw, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface RecurringExpenseDetailsProps {
  expense: RecurringExpense;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const RecurringExpenseDetails = ({ expense, onClose, open, onOpenChange }: RecurringExpenseDetailsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const formattedDate = expense.created_at 
    ? format(new Date(expense.created_at), "dd MMMM yyyy", { locale: fr })
    : "Date inconnue";

  const getDebitInfo = () => {
    switch (expense.periodicity) {
      case "monthly":
        return `Le ${expense.debit_day} de chaque mois`;
      case "quarterly":
        return `Le ${expense.debit_day} du mois ${expense.debit_month || 1} chaque trimestre`;
      case "yearly":
        return `Le ${expense.debit_day} du mois ${expense.debit_month || 1} chaque année`;
      default:
        return "Information non disponible";
    }
  };

  const content = (
    <DialogContent 
      className={cn(
        "p-0 overflow-hidden border-0 shadow-2xl sm:max-w-[500px]",
        // Light mode
        "bg-white",
        // Dark mode
        "dark:bg-gray-800/95"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)"
      }}
    >
      {/* En-tête avec dégradé subtil */}
      <div 
        className={cn(
          "relative overflow-hidden py-6 px-6",
          // Light mode
          "bg-gradient-to-br from-blue-50 to-white",
          // Dark mode
          "dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-gray-800/90"
        )}
      >
        {/* Cercle décoratif en arrière-plan */}
        <div className={cn(
          "absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20",
          // Light mode
          "bg-gradient-to-br from-blue-400 to-blue-600",
          // Dark mode
          "dark:from-blue-500 dark:to-blue-700 dark:opacity-10"
        )} />

        <div className="flex items-center gap-4 relative z-10">
          {expense.logo_url ? (
            <div 
              className={cn(
                "w-14 h-14 rounded-lg p-2 flex items-center justify-center overflow-hidden",
                // Light mode
                "bg-white shadow-sm border border-gray-200",
                // Dark mode
                "dark:bg-gray-800 dark:border-gray-700"
              )}
            >
              <img
                src={expense.logo_url}
                alt={expense.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
          ) : (
            <div 
              className={cn(
                "w-14 h-14 rounded-lg flex items-center justify-center",
                // Light mode
                "bg-blue-100 text-blue-600",
                // Dark mode
                "dark:bg-blue-800/40 dark:text-blue-400"
              )}
            >
              <CreditCard size={24} />
            </div>
          )}
          
          <div>
            <DialogTitle 
              className={cn(
                "text-xl font-bold pb-1",
                // Light mode
                "text-gray-800",
                // Dark mode
                "dark:text-gray-100"
              )}
            >
              {expense.name}
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "h-6 font-medium border px-2 py-0",
                  // Light mode
                  "bg-blue-50 border-blue-200 text-blue-700",
                  // Dark mode
                  "dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
                )}
              >
                {expense.amount.toLocaleString('fr-FR')} €/
                {expense.periodicity === "monthly" ? "mois" : 
                  expense.periodicity === "quarterly" ? "trim." : "an"}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={cn(
                  "h-6 font-medium border px-2 py-0",
                  // Light mode
                  "bg-gray-50 border-gray-200 text-gray-700",
                  // Dark mode
                  "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                )}
              >
                {expense.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ligne séparatrice avec dégradé */}
      <div className={cn(
        "h-px w-full",
        // Light mode
        "bg-gradient-to-r from-transparent via-blue-100 to-transparent",
        // Dark mode
        "dark:from-transparent dark:via-blue-900/30 dark:to-transparent"
      )} />

      {/* Contenu détaillé */}
      <div className="py-5 px-6">
        <div className="space-y-4">
          {/* Périodicité */}
          <DetailItem 
            icon={<RefreshCcw size={18} />} 
            label="Périodicité" 
            value={periodicityLabels[expense.periodicity]} 
          />
          
          {/* Information de prélèvement */}
          <DetailItem 
            icon={<CreditCard size={18} />} 
            label="Prélèvement" 
            value={getDebitInfo()}
          />
          
          {/* Catégorie */}
          <DetailItem 
            icon={<Tag size={18} />} 
            label="Catégorie" 
            value={expense.category}
          />
          
          {/* Date d'ajout */}
          <DetailItem 
            icon={<Calendar size={18} />} 
            label="Ajouté le" 
            value={formattedDate}
          />
        </div>

        {expense.notes && (
          <div className={cn(
            "mt-6 p-4 rounded-lg",
            // Light mode
            "bg-gray-50 border border-gray-200",
            // Dark mode
            "dark:bg-gray-800/80 dark:border-gray-700"
          )}>
            <h4 className={cn(
              "text-sm font-medium mb-2",
              // Light mode
              "text-gray-700",
              // Dark mode
              "dark:text-gray-300"
            )}>
              Notes
            </h4>
            <p className={cn(
              "text-sm",
              // Light mode
              "text-gray-600",
              // Dark mode
              "dark:text-gray-400"
            )}>
              {expense.notes}
            </p>
          </div>
        )}
      </div>
    </DialogContent>
  );

  // Si les props open et onOpenChange sont fournies, utiliser Dialog directement
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {content}
      </Dialog>
    );
  }

  // Retourner uniquement le contenu si pas de props open/onOpenChange
  return content;
};

// Composant réutilisable pour chaque ligne de détail
const DetailItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="flex items-start">
      <div className={cn(
        "w-9 h-9 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0",
        // Light mode
        "bg-gray-100 text-blue-500",
        // Dark mode
        "dark:bg-gray-800 dark:text-blue-400"
      )}>
        {icon}
      </div>
      
      <div className="ml-3 flex-1">
        <div className={cn(
          "text-sm",
          // Light mode
          "text-gray-500",
          // Dark mode
          "dark:text-gray-400"
        )}>
          {label}
        </div>
        <div className={cn(
          "font-medium mt-0.5",
          // Light mode
          "text-gray-800",
          // Dark mode
          "dark:text-gray-200"
        )}>
          {value}
        </div>
      </div>
    </div>
  );
};
