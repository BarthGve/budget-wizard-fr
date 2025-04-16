
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const ChartBackground = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fond principal avec dégradé subtil */}
      <div className={cn(
        "absolute inset-0 z-0",
        // Mode clair
        "bg-gradient-to-tr from-tertiary-50/80 via-white to-tertiary-50/60",
        // Mode sombre - amélioration du contraste
        "dark:bg-gradient-to-tr dark:from-gray-900/90 dark:via-gray-800/80 dark:to-tertiary-950/30",
        "dark:border-tertiary-700/20" // Bordure subtile en mode sombre
      )}/>
      
      {/* Élément décoratif radial */}
      <div className={cn(
        "absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30",
        // Mode clair
        "bg-gradient-to-br from-tertiary-200 to-tertiary-400",
        // Mode sombre - plus visible et harmonieux
        "dark:from-tertiary-700/50 dark:to-tertiary-500/30 dark:opacity-20"
      )}/>
      
      {/* Motif en grille subtil */}
      <div className={cn(
        "absolute inset-0 z-0",
        // Seulement visible en mode sombre pour améliorer la profondeur
        "dark:bg-[radial-gradient(circle_at_top_right,rgba(120,120,255,0.05)_1px,transparent_1px)] dark:bg-[size:20px_20px]"
      )}/>
    </div>
  );
};
