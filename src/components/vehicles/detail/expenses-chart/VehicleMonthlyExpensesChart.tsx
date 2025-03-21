
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExpensesChartHeader } from "./components/ExpensesChartHeader";
import { GradientBackground } from "./components/GradientBackground";
import { ExpensesChartContent } from "./components/ExpensesChartContent";

interface VehicleMonthlyExpensesChartProps {
  vehicleId: string;
}

export const VehicleMonthlyExpensesChart = ({ vehicleId }: VehicleMonthlyExpensesChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-sm",
        // Light mode
        "bg-white border-gray-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:border-gray-700/50 dark:shadow-gray-900/10"
      )}>
        <GradientBackground />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <div>
            <ExpensesChartHeader />
          </div>
        </CardHeader>
        
        <ExpensesChartContent vehicleId={vehicleId} />
      </Card>
    </motion.div>
  );
};
