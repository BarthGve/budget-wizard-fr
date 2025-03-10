
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RecurringExpense, periodicityLabels } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Calendar, CreditCard, Tag, RefreshCcw } from "lucide-react";
import { DetailItem } from "./details/DetailItem";
import { ExpenseHeader } from "./details/ExpenseHeader";
import { ExpenseNotes } from "./details/ExpenseNotes";

export interface RecurringExpenseDetailsProps {
  expense: RecurringExpense;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const RecurringExpenseDetails = ({ 
  expense, 
  onClose, 
  open, 
  onOpenChange 
}: RecurringExpenseDetailsProps) => {
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
      <ExpenseHeader expense={expense} />
      
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
          <DetailItem 
            icon={<RefreshCcw size={18} />} 
            label="Périodicité" 
            value={periodicityLabels[expense.periodicity]} 
          />
          
          <DetailItem 
            icon={<CreditCard size={18} />} 
            label="Prélèvement" 
            value={getDebitInfo()}
          />
          
          <DetailItem 
            icon={<Tag size={18} />} 
            label="Catégorie" 
            value={expense.category}
          />
          
          <DetailItem 
            icon={<Calendar size={18} />} 
            label="Ajouté le" 
            value={formattedDate}
          />
        </div>

        <ExpenseNotes expense={expense} />
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
