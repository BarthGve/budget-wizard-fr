import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, BarChart2, TrendingUp } from "lucide-react";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { useVehicleExpenseStats } from "@/hooks/useVehicleExpenseStats";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface VehicleExpenseStatsProps {
  vehicleId: string;
}

export const VehicleExpenseStats = ({ vehicleId }: VehicleExpenseStatsProps) => {
  const { expenses, isLoading } = useVehicleExpenses(vehicleId);
  const stats = useVehicleExpenseStats(expenses);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  if (isLoading) {
    return (
      <Card 
        className={cn(
          "w-full h-[200px] flex items-center justify-center",
          "border overflow-hidden",
          "bg-white border-gray-200",
          "dark:bg-slate-900 dark:border-gray-800"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
            : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-600 dark:border-gray-400 rounded-full"></div>
      </Card>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card 
        className={cn(
          "w-full p-6",
          "border overflow-hidden transform-gpu backface-hidden",
          "bg-white border-gray-200 hover:border-gray-300",
          "dark:bg-slate-900 dark:border-gray-800 dark:hover:border-gray-700"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
            : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
        }}
      >
        <CardHeader className={cn(
          "pb-2 ",
     
        )}>
          <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <div className="p-1.5 rounded-md bg-gray-200/80 dark:bg-gray-700/50">
              <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            Statistiques des dépenses
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(
          "bg-gradient-to-b from-white to-gray-50/30",
          "dark:bg-gradient-to-b dark:from-slate-900 dark:to-gray-800/10"
        )}>
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Aucune dépense enregistrée pour ce véhicule.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className={cn(
        "border overflow-hidden transform-gpu backface-hidden",
        "bg-white border-gray-200 hover:border-gray-300",
        "dark:bg-slate-900 dark:border-gray-800 dark:hover:border-gray-700"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <CardHeader className={cn(
          "pb-2 border-b",
          "bg-gradient-to-r from-gray-50 to-gray-100/50",
          "dark:bg-gradient-to-r dark:from-slate-900 dark:to-gray-800/40",
          "border-gray-200 dark:border-gray-800"
        )}>
          <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <div className="p-1.5 rounded-md bg-gray-200/80 dark:bg-gray-700/50">
              <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            Statistiques des dépenses
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(
          "space-y-6 p-4 pt-6",
          "bg-gradient-to-b from-white to-gray-50/30",
          "dark:bg-gradient-to-b dark:from-slate-900 dark:to-gray-800/10"
        )}>
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Total des dépenses */}
            <StatCard 
              title="Total des dépenses"
              value={formatCurrency(stats.totalExpense)}
              subtitle={`${stats.expenseCount} opérations`}
              icon={<TrendingUp className="h-5 w-5" />}
              color="blue"
            />
            
            {/* Dépenses carburant */}
            <StatCard 
              title="Dépenses carburant"
              value={formatCurrency(stats.totalFuelExpense)}
              subtitle={`${stats.totalFuelVolume.toFixed(2)} litres`}
              icon={<Fuel className="h-5 w-5" />}
              color="amber"
            />
            
            {/* Prix moyen du carburant */}
            <StatCard 
              title="Prix moyen carburant"
              value={`${stats.averageFuelPrice.toFixed(3)} €/L`}
              subtitle="Tous pleins confondus"
              icon={<Fuel className="h-5 w-5" />}
              color="green"
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className={cn(
              "mt-6 pt-6 pb-2",
              "border-t border-gray-200 dark:border-gray-800"
            )}
          >
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-4 ml-1">
              Statistiques de l'année en cours
            </h3>
            
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg",
              "bg-gray-100/50 dark:bg-gray-800/30",
              "border border-gray-200/50 dark:border-gray-700/50"
            )}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total dépenses:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(stats.yearToDateExpenses.totalExpense)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre d'opérations:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{stats.yearToDateExpenses.expenseCount}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dépenses carburant:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(stats.yearToDateExpenses.totalFuelExpense)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volume de carburant:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{stats.yearToDateExpenses.totalFuelVolume.toFixed(2)} L</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prix moyen:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{stats.yearToDateExpenses.averageFuelPrice.toFixed(3)} €/L</span>
                </div>
                <div className="flex justify-between items-center opacity-0">
                  <span className="text-sm">Placeholder</span>
                  <span className="font-medium">Placeholder</span>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Composant pour afficher une carte de statistique
interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "purple" | "red";
}

const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => {
  const getColorClasses = (color: string) => {
    switch(color) {
      case "blue":
        return {
          background: "bg-blue-50 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200/50 dark:border-blue-800/50",
          shadow: "shadow-sm shadow-blue-100 dark:shadow-blue-900/20"
        };
      case "green":
        return {
          background: "bg-green-50 dark:bg-green-900/20",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-200/50 dark:border-green-800/50",
          shadow: "shadow-sm shadow-green-100 dark:shadow-green-900/20"
        };
      case "amber":
        return {
          background: "bg-amber-50 dark:bg-amber-900/20",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-200/50 dark:border-amber-800/50",
          shadow: "shadow-sm shadow-amber-100 dark:shadow-amber-900/20"
        };
      case "purple":
        return {
          background: "bg-purple-50 dark:bg-purple-900/20",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200/50 dark:border-purple-800/50",
          shadow: "shadow-sm shadow-purple-100 dark:shadow-purple-900/20"
        };
      case "red":
        return {
          background: "bg-red-50 dark:bg-red-900/20",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-200/50 dark:border-red-800/50",
          shadow: "shadow-sm shadow-red-100 dark:shadow-red-900/20"
        };
      default:
        return {
          background: "bg-gray-50 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200/50 dark:border-gray-700/50",
          shadow: "shadow-sm shadow-gray-100 dark:shadow-gray-900/20"
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={cn(
      "flex flex-col space-y-3 p-5 rounded-lg",
      "border transition-all",
      "bg-white dark:bg-gray-800/50",
      colorClasses.border,
      colorClasses.shadow,
      "hover:translate-y-[-2px]",
      "hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/5"
    )}>
      <div className="flex items-center space-x-2">
        <div className={cn(
          "p-2 rounded-md",
          colorClasses.background,
          colorClasses.text
        )}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
      </div>
    </div>
  );
};
