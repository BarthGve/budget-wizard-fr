
import { useTheme } from "next-themes";

/**
 * Hook pour obtenir une palette de couleurs adaptée au thème
 */
export const useChartColorPalette = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Configurer les couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  
  // Générer une palette de couleurs variée pour les barres
  const getColorPalette = () => {
    return [
      // Palette de couleurs distinctes
      {
        light: "#3B82F6", // Bleu
        dark: "#60A5FA"
      },
      {
        light: "#F97316", // Orange
        dark: "#FB923C"
      },
      {
        light: "#9b87f5", // Violet
        dark: "#b19df7"
      },
      {
        light: "#10B981", // Vert
        dark: "#34D399"
      },
      {
        light: "#EF4444", // Rouge
        dark: "#F87171"
      },
      {
        light: "#EC4899", // Rose
        dark: "#F472B6"
      },
      {
        light: "#F59E0B", // Ambre
        dark: "#FBBF24"
      },
      {
        light: "#6366F1", // Indigo
        dark: "#818CF8"
      },
      {
        light: "#0EA5E9", // Cyan
        dark: "#38BDF8"
      },
      {
        light: "#8B5CF6", // Violet foncé
        dark: "#A78BFA"
      }
    ];
  };

  // Obtenir la couleur pour un indice spécifique
  const getBarColor = (index: number) => {
    const palette = getColorPalette();
    const colorSet = palette[index % palette.length];
    
    return isDarkMode ? colorSet.dark : colorSet.light;
  };
  
  return {
    isDarkMode,
    gridColor,
    axisColor,
    getBarColor
  };
};
