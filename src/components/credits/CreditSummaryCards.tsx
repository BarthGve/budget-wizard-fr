
import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

interface CreditSummaryCardsProps {
  activeCredits: any[];
  repaidThisMonth: number;
  totalActiveMensualites: number;
  totalRepaidMensualitesThisMonth: number;
}

export const CreditSummaryCards = memo(({
  activeCredits,
  repaidThisMonth,
  totalActiveMensualites,
  totalRepaidMensualitesThisMonth
}: CreditSummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card className={cn(
        "overflow-hidden border transition-all duration-200",
        // Light mode
        "border-0 shadow-sm hover:shadow-md bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600",
        // Dark mode
        "dark:border-purple-800/60 dark:from-purple-800 dark:via-violet-800 dark:to-purple-900"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Crédits actifs</CardTitle>
          <CardDescription className="text-violet-100">
            {activeCredits.length} crédit(s) en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {totalActiveMensualites.toLocaleString('fr-FR')} €
          </div>
          <div className="text-violet-100 mt-2">
            Mensualités totales
          </div>
        </CardContent>
      </Card>

      <Card className={cn(
        "overflow-hidden border transition-all duration-200",
        // Light mode
        "border-0 shadow-sm hover:shadow-md bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
        // Dark mode
        "dark:border-green-800/60 dark:from-green-700 dark:via-emerald-800 dark:to-teal-900"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Crédits remboursés ce mois</CardTitle>
          <CardDescription className="text-emerald-100">
            {repaidThisMonth} crédit(s) à échéance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {totalRepaidMensualitesThisMonth.toLocaleString('fr-FR')} €
          </div>
          <div className="text-emerald-100 mt-2">
            Mensualités échues
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CreditSummaryCards.displayName = "CreditSummaryCards";
