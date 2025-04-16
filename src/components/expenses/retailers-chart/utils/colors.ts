
import { useTheme } from "next-themes";
import { useMemo } from "react";

export const useChartColorPalette = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const barColors = useMemo(() => [
    isDarkMode ? "hsl(var(--tertiary-500))" : "hsl(var(--tertiary-500))",   // Couleur principale - tertiary
    isDarkMode ? "hsl(var(--primary-500))" : "hsl(var(--primary-500))",     // Couleur secondaire - primary
    isDarkMode ? "hsl(var(--quinary-500))" : "hsl(var(--quinary-500))",     // Couleur verte - quinary
    isDarkMode ? "hsl(var(--senary-500))" : "hsl(var(--senary-500))",       // Couleur orange - senary
    isDarkMode ? "hsl(var(--quaternary-500))" : "hsl(var(--quaternary-500))", // Couleur bleue - quaternary
    isDarkMode ? "#F59E0B" : "#EAB308", // amber-500 / yellow-500
    isDarkMode ? "#06B6D4" : "#06B6D4", // cyan-500
    isDarkMode ? "#EF4444" : "#EF4444", // red-500
    isDarkMode ? "#10B981" : "#10B981", // emerald-500
    isDarkMode ? "#6366F1" : "#6366F1", // indigo-500
  ], [isDarkMode]);

  // Augmentation du contraste pour les axes en mode sombre
  const axisColor = isDarkMode ? "rgba(255, 255, 255, 0.75)" : "rgba(107, 114, 128, 0.9)";

  const getBarColor = (index: number): string => {
    return barColors[index % barColors.length];
  };

  return {
    barColors,
    axisColor,
    getBarColor,
    isDarkMode
  };
};
