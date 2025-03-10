
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
import { CreditCard, Banknote } from "lucide-react";

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
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
  className="grid gap-4 md:grid-cols-2 mb-6"
>
  <motion.div
    whileHover={{ 
      y: -5, 
      transition: { duration: 0.2 }
    }}
  >
    <Card className={cn(
      "overflow-hidden transition-all duration-200 h-full relative",
      "border shadow-sm hover:shadow-md",
      // Light mode
      "bg-white border-purple-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:hover:bg-purple-900/20 dark:border-purple-800/50"
    )}>
      {/* Fond radial gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400 via-violet-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-purple-400 dark:via-violet-500 dark:to-transparent"
      )} />
      
      <CardHeader className="pb-2 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={cn(
              // Light mode
              "bg-purple-100 text-purple-700",
              // Dark mode
              "dark:bg-purple-800/40 dark:text-purple-300",
              // Common
              "p-2 rounded-lg"
            )}>
              <CreditCard className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              // Light mode
              "text-purple-700",
              // Dark mode
              "dark:text-purple-300"
            )}>
              Crédits actifs
            </CardTitle>
          </div>
        </div>
        
        <CardDescription className={cn(
          "mt-2 text-sm",
          // Light mode
          "text-purple-600/80",
          // Dark mode
          "dark:text-purple-400/90"
        )}>
          {activeCredits.length} crédit(s) en cours
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-1 pb-6 relative z-10">
        <p className={cn(
          "text-2xl font-bold",
          // Light mode
          "text-purple-700",
          // Dark mode
          "dark:text-purple-300"
        )}>
          {totalActiveMensualites.toLocaleString('fr-FR')} €
        </p>
        <p className={cn(
          "text-sm mt-1",
          // Light mode
          "text-purple-600/80",
          // Dark mode
          "dark:text-purple-400/90"
        )}>
          Mensualités totales
          <span className="ml-2 inline-block bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300 text-xs py-0.5 px-2 rounded-full">
            mensuels
          </span>
        </p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div
    whileHover={{ 
      y: -5, 
      transition: { duration: 0.2 }
    }}
  >
    <Card className={cn(
      "overflow-hidden transition-all duration-200 h-full relative",
      "border shadow-sm hover:shadow-md",
      // Light mode
      "bg-white border-green-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:hover:bg-green-900/20 dark:border-green-800/50"
    )}>
      {/* Fond radial gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400 via-emerald-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-green-400 dark:via-emerald-500 dark:to-transparent"
      )} />
      
      <CardHeader className="pb-2 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={cn(
              // Light mode
              "bg-green-100 text-green-700",
              // Dark mode
              "dark:bg-green-800/40 dark:text-green-300",
              // Common
              "p-2 rounded-lg"
            )}>
              <Banknote className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              // Light mode
              "text-green-700",
              // Dark mode
              "dark:text-green-300"
            )}>
              Remboursements du mois
            </CardTitle>
          </div>
        </div>
        
        <CardDescription className={cn(
          "mt-2 text-sm",
          // Light mode
          "text-green-600/80",
          // Dark mode
          "dark:text-green-400/90"
        )}>
          {monthlyStats.credits_rembourses_count} crédit(s) à échéance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-1 pb-6 relative z-10">
        <p className={cn(
          "text-2xl font-bold",
          // Light mode
          "text-green-700",
          // Dark mode
          "dark:text-green-300"
        )}>
          {monthlyStats.total_mensualites_remboursees.toLocaleString('fr-FR')} €
        </p>
        <p className={cn(
          "text-sm mt-1",
          // Light mode
          "text-green-600/80",
          // Dark mode
          "dark:text-green-400/90"
        )}>
          Mensualités échues
          <span className="ml-2 inline-block bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-xs py-0.5 px-2 rounded-full">
            ce mois
          </span>
        </p>
      </CardContent>
    </Card>
  </motion.div>
</motion.div>

</>
  );
});

CreditSummaryCards.displayName = "CreditSummaryCards";
