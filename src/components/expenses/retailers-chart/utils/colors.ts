
import { useTheme } from "next-themes";
import { useMemo } from "react";

export const useChartColorPalette = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const barColors = useMemo(() => [
    isDarkMode ? "#3B82F6" : "#3B82F6", // blue-500
    isDarkMode ? "#EC4899" : "#EC4899", // pink-500
    isDarkMode ? "#22C55E" : "#22C55E", // green-500
    isDarkMode ? "#F97316" : "#F97316", // orange-500
    isDarkMode ? "#8B5CF6" : "#8B5CF6", // violet-500
    isDarkMode ? "#EAB308" : "#EAB308", // yellow-500
    isDarkMode ? "#06B6D4" : "#06B6D4", // cyan-500
    isDarkMode ? "#EF4444" : "#EF4444", // red-500
    isDarkMode ? "#10B981" : "#10B981", // emerald-500
    isDarkMode ? "#6366F1" : "#6366F1", // indigo-500
  ], [isDarkMode]);

  const axisColor = isDarkMode ? "#6B7280" : "#6B7280"; // gray-500

  const getBarColor = (index: number): string => {
    return barColors[index % barColors.length];
  };

  return {
    barColors,
    axisColor,
    getBarColor
  };
};
