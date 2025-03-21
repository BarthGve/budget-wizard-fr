
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, BarChart2, TrendingUp } from "lucide-react";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { useVehicleExpenseStats } from "@/hooks/useVehicleExpenseStats";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VehicleExpenseStatsProps {
  vehicleId: string;
}

export const VehicleExpenseStats = ({ vehicleId }: VehicleExpenseStatsProps) => {
  const { expenses, isLoading } = useVehicleExpenses(vehicleId);
  const stats = useVehicleExpenseStats(expenses);

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[200px] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </Card>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card className="w-full p-6 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
            Statistiques des dépenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
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
        "border shadow-sm overflow-hidden",
        "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800/70">
              <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            Statistiques des dépenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
            className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
          >
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-3">
              Statistiques de l'année en cours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total dépenses:</span>
                  <span className="font-medium">{formatCurrency(stats.yearToDateExpenses.totalExpense)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre d'opérations:</span>
                  <span className="font-medium">{stats.yearToDateExpenses.expenseCount}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dépenses carburant:</span>
                  <span className="font-medium">{formatCurrency(stats.yearToDateExpenses.totalFuelExpense)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volume de carburant:</span>
                  <span className="font-medium">{stats.yearToDateExpenses.totalFuelVolume.toFixed(2)} L</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prix moyen:</span>
                  <span className="font-medium">{stats.yearToDateExpenses.averageFuelPrice.toFixed(3)} €/L</span>
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
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "green":
        return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "amber":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
      case "purple":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "red":
        return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
      <div className="flex items-center space-x-2">
        <div className={cn("p-2 rounded", getColorClasses(color))}>
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
