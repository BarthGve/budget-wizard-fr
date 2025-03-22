
import { motion, AnimatePresence } from "framer-motion";
import { MonthlyBarChart } from "./MonthlyBarChart";
import { YearlyBarChart } from "./YearlyBarChart";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  viewMode: 'monthly' | 'yearly';
  dataVersion: number;
  yearlyData: Array<Record<string, any>>;
  retailerExpenses: Array<{ name: string; total: number }>;
  topRetailers: string[];
  gridColor: string;
  axisColor: string;
  barColor: string;
  getBarColor: (index: number) => string;
}

export function ChartContainer({
  viewMode,
  dataVersion,
  yearlyData,
  retailerExpenses,
  topRetailers,
  gridColor,
  axisColor,
  barColor,
  getBarColor
}: ChartContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dataVersion}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-[250px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'monthly' ? (
            <MonthlyBarChart 
              retailerExpenses={retailerExpenses}
              gridColor={gridColor}
              axisColor={axisColor}
              barColor={barColor}
            />
          ) : (
            <YearlyBarChart 
              yearlyData={yearlyData}
              topRetailers={topRetailers}
              gridColor={gridColor}
              axisColor={axisColor}
              getBarColor={getBarColor}
            />
          )}
        </ResponsiveContainer>
      </motion.div>
    </AnimatePresence>
  );
}
