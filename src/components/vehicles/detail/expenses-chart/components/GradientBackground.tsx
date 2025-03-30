
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const GradientBackground = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <div className="absolute inset-0 z-0">
      <div className={cn(
        "absolute inset-0",
        "bg-gradient-to-br from-gray-50/80 to-white",
        "dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-gray-800/50"
      )} />
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-2/3",
        "bg-gradient-to-t from-white/80 to-transparent",
        "dark:bg-gradient-to-t dark:from-gray-900/80 dark:to-transparent"
      )} />
      
      <div className={cn(
        "absolute top-0 left-0 w-full h-full",
        "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
        "from-transparent via-transparent to-white/80",
        "dark:from-transparent dark:via-transparent dark:to-gray-900/80"
      )} />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: isDarkMode 
            ? 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)'
            : 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};
