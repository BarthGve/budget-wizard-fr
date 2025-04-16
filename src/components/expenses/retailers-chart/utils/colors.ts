
import { useTheme } from "next-themes";
import { useMemo } from "react";

export const useChartColorPalette = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const barColors = useMemo(() => [
    isDarkMode ? "hsl(var(--tertiary-600))" : "hsl(var(--tertiary-500))",   // Couleur principale - tertiary
    isDarkMode ? "hsl(var(--primary-600))" : "hsl(var(--primary-500))",     // Couleur secondaire - primary
    isDarkMode ? "hsl(var(--quinary-600))" : "hsl(var(--quinary-500))",     // Couleur verte - quinary
    isDarkMode ? "hsl(var(--senary-600))" : "hsl(var(--senary-500))",       // Couleur orange - senary
    isDarkMode ? "hsl(var(--quaternary-600))" : "hsl(var(--quaternary-500))", // Couleur bleue - quaternary
    isDarkMode ? "#EAB308" : "#EAB308", // yellow-500
    isDarkMode ? "#06B6D4" : "#06B6D4", // cyan-500
    isDarkMode ? "#EF4444" : "#EF4444", // red-500
    isDarkMode ? "#10B981" : "#10B981", // emerald-500
    isDarkMode ? "#6366F1" : "#6366F1", // indigo-500
  ], [isDarkMode]);

  const axisColor = isDarkMode ? "rgba(255, 255, 255, 0.65)" : "rgba(107, 114, 128, 0.9)"; // Augmentation du contraste

  const getBarColor = (index: number): string => {
    return barColors[index % barColors.length];
  };

  // Ajout de isDarkMode à l'objet retourné
  return {
    barColors,
    axisColor,
    getBarColor,
    isDarkMode
  };
};
