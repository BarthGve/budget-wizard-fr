
import { CreditCard as CreditCardIcon } from "lucide-react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreditCardBadge } from "./CreditCardBadge";

interface CreditCardHeaderProps {
  tauxEndettement: number;
  badgeVariant: "default" | "secondary" | "destructive";
  currentView: "monthly" | "yearly";
  currentMonthName: string;
  currentYear: number;
}

/**
 * Composant qui affiche l'en-tête de la carte de crédit
 */
export const CreditCardHeader = ({
  tauxEndettement,
  badgeVariant,
  currentView,
  currentMonthName,
  currentYear
}: CreditCardHeaderProps) => {
  return (
    <CardHeader className="py-4">
      <div className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full",
            "bg-purple-100 text-purple-600", // Light mode
            "dark:bg-purple-900/40 dark:text-purple-400" // Dark mode
          )}>
            <CreditCardIcon className="h-5 w-5" />
          </div>
          <span className="text-gray-800 dark:text-white">Crédits</span>
        </CardTitle>
        <CreditCardBadge 
          tauxEndettement={tauxEndettement}
          badgeVariant={badgeVariant}
          currentView={currentView}
        />
      </div>
      <CardDescription className={cn(
        "text-gray-500",
        "dark:text-gray-400"
      )}>
        {currentView === "monthly" 
          ? `Total dû en ${currentMonthName}` 
          : `Total dû en ${currentYear}`}
      </CardDescription>
    </CardHeader>
  );
};
