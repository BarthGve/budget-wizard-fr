
import { useTheme } from "next-themes";

export function useChartStyles() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Configurer les couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const barColor = "#3B82F6"; // Couleur principale bleue

  // Générer une palette de couleurs pour les barres empilées
  const getBarColor = (index: number) => {
    const colors = [
      "#3B82F6", // Bleu principal
      "#60A5FA", // Bleu clair
      "#93C5FD", // Bleu très clair
      "#1D4ED8", // Bleu foncé
      "#2563EB", // Bleu moyen
      "#DBEAFE", // Bleu pâle
      "#06B6D4", // Cyan
      "#0284C7", // Bleu-cyan foncé
      "#0EA5E9", // Bleu-cyan clair
      "#38BDF8", // Bleu ciel
    ];
    return colors[index % colors.length];
  };

  return {
    isDarkMode,
    gridColor,
    axisColor,
    barColor,
    getBarColor
  };
}
