
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export const GradientBackground = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-0 overflow-hidden rounded-b-lg"
    >
      <div className={cn(
        "absolute inset-0",
        "bg-gradient-to-br from-gray-50/90 to-white/80",
        "dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-gray-800/60"
      )} />
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-2/3",
        "bg-gradient-to-t from-white/90 to-transparent",
        "dark:bg-gradient-to-t dark:from-gray-900/90 dark:to-transparent"
      )} />
      
      <div className={cn(
        "absolute top-0 left-0 w-full h-full",
        "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
        "from-transparent via-transparent to-white/90",
        "dark:from-transparent dark:via-transparent dark:to-gray-900/90"
      )} />
      
      {/* Grille subtile avec animation */}
      <div 
        className={cn(
          "absolute inset-0 opacity-5 dark:opacity-10",
          "bg-grid-pattern"
        )}
        style={{
          backgroundImage: isDarkMode 
            ? 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)'
            : 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPositionX: 'center'
        }}
      />
      
      {/* Points de données subtils */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={`dot-${i}`}
            className={cn(
              "absolute w-1.5 h-1.5 rounded-full",
              "bg-gray-400/10 dark:bg-gray-400/5"
            )}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
