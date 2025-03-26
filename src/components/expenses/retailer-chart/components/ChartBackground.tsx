
import { cn } from "@/lib/utils";

/**
 * Composant pour l'arrière-plan du graphique avec dégradé
 */
export function ChartBackground() {
  return (
    <div className={cn(
      "absolute inset-0 opacity-5",
      // Light mode
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
      // Dark mode
      "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
    )} />
  );
}
