
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { formatCurrency } from "@/utils/format";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Banknote, Droplets, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export const DashboardExtraCards = () => {
  const { currentMonthExpenses, vehicleFuelExpenses, isLoading } = useExpenseStats();
  const { profile } = usePagePermissions();
  
  // Vérifier si l'utilisateur a un profil "pro"
  const isPro = useMemo(() => profile?.profile_type === "pro", [profile]);
  
  // Obtenir le nom du mois courant
  const currentMonthName = useMemo(() => {
    return new Date().toLocaleString('fr-FR', { month: 'long' });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card pour les dépenses du mois en cours */}
      <motion.div variants={itemVariants}>
        <Card className={cn(
          "border shadow-sm overflow-hidden relative h-full",
          "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20",
        )}>
          <div className="p-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">
                Dépenses de {currentMonthName}
              </h3>
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/40">
                <Banknote className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            
            <div className="mt-4">
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-32"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(currentMonthExpenses.total)}
                </p>
              )}
              
              <p className="text-sm mt-1 text-gray-600/80 dark:text-gray-400/90">
                {currentMonthExpenses.count} transaction{currentMonthExpenses.count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Card pour les dépenses de carburant */}
      <motion.div variants={itemVariants}>
        <Card className={cn(
          "border shadow-sm overflow-hidden relative h-full",
          "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20",
        )}>
          <div className="p-5 relative">
            {!isPro && (
              <div className="absolute inset-0 backdrop-blur-md z-10 flex flex-col items-center justify-center bg-gray-100/50 dark:bg-gray-800/50">
                <LockKeyhole className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" />
                <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
                  Fonctionnalité réservée aux profils Pro
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">
                Dépenses de carburant
              </h3>
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/40">
                <Droplets className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            
            <div className="mt-4">
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-32"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(vehicleFuelExpenses.total)}
                </p>
              )}
              
              <p className="text-sm mt-1 text-gray-600/80 dark:text-gray-400/90">
                {vehicleFuelExpenses.count} transaction{vehicleFuelExpenses.count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
