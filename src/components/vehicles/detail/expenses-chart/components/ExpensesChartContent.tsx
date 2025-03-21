
import { AnimatePresence, motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { VehicleExpensesBarChart } from "../VehicleExpensesBarChart";

interface ExpensesChartContentProps {
  vehicleId: string;
}

export const ExpensesChartContent = ({ vehicleId }: ExpensesChartContentProps) => {
  return (
    <CardContent className="pt-4 relative z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={`vehicle-expenses-chart`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <VehicleExpensesBarChart vehicleId={vehicleId} />
        </motion.div>
      </AnimatePresence>
    </CardContent>
  );
};
