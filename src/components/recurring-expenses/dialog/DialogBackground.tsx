
import { cn } from "@/lib/utils";

interface DialogBackgroundProps {
  isDarkMode: boolean;
}

/**
 * Composant pour l'arrière-plan décoratif du dialogue
 */
export const DialogBackground = ({ isDarkMode }: DialogBackgroundProps) => {
  return (
    <>
      {/* Fond avec dégradé de base */}
      <div className={cn(
        "absolute inset-0",
        "bg-gradient-to-b from-blue-50/70 to-white",
        "dark:from-blue-950/20 dark:to-gray-900/60",
        "pointer-events-none"
      )}>
        {/* Effet radial supplémentaire */}
        <div className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
          "from-blue-100/40 via-blue-50/20 to-transparent",
          "dark:from-blue-800/15 dark:via-blue-700/10 dark:to-transparent",
          "opacity-60"
        )} />
      </div>
    </>
  );
};
