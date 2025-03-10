
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
    <>
   {/* Cards avec dégradés inspirés des dépenses */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
  className="grid gap-4 md:grid-cols-2 mb-6"
>
  <Card className={cn(
    "overflow-hidden border transition-all duration-200",
    // Light mode - dégradé violet plus subtil
    "border-0 shadow-sm hover:shadow-md bg-gradient-to-br from-violet-500/90 via-purple-500/95 to-purple-600",
    // Dark mode - tons plus profonds
    "dark:border-purple-900/30 dark:from-purple-900 dark:via-purple-800 dark:to-violet-800"
  )}>
    <CardHeader className="pb-2">
      <CardTitle className="text-white flex items-center">
        <CreditCard className="h-5 w-5 mr-2 opacity-80" />
        Crédits actifs
      </CardTitle>
      <CardDescription className="text-violet-50/90 dark:text-violet-200/80">
        {activeCredits.length} crédit(s) en cours
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">
        {totalActiveMensualites.toLocaleString('fr-FR')} €
      </div>
      <div className="text-violet-50/90 dark:text-violet-200/80 mt-2 flex items-center">
        <span>Mensualités totales</span>
        <span className="ml-auto bg-purple-700/40 dark:bg-purple-950/50 text-xs py-0.5 px-2 rounded-full">
          mensuels
        </span>
      </div>
    </CardContent>
  </Card>

  <Card className={cn(
    "overflow-hidden border transition-all duration-200",
    // Light mode - dégradé vert plus subtil
    "border-0 shadow-sm hover:shadow-md bg-gradient-to-br from-emerald-500/90 via-green-500/95 to-teal-600",
    // Dark mode - tons plus profonds
    "dark:border-emerald-900/30 dark:from-emerald-900 dark:via-green-800 dark:to-teal-800"
  )}>
    <CardHeader className="pb-2">
      <CardTitle className="text-white flex items-center">
        <Banknote className="h-5 w-5 mr-2 opacity-80" />
        Remboursements du mois
      </CardTitle>
      <CardDescription className="text-green-50/90 dark:text-green-200/80">
        {monthlyStats.credits_rembourses_count} crédit(s) à échéance
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">
        {monthlyStats.total_mensualites_remboursees.toLocaleString('fr-FR')} €
      </div>
      <div className="text-green-50/90 dark:text-green-200/80 mt-2 flex items-center">
        <span>Mensualités échues</span>
        <span className="ml-auto bg-green-700/40 dark:bg-green-950/50 text-xs py-0.5 px-2 rounded-full">
          ce mois
        </span>
      </div>
    </CardContent>
  </Card>
</motion.div>
</>
  );
});

CreditSummaryCards.displayName = "CreditSummaryCards";
