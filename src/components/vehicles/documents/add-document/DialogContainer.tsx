
import { cn } from "@/lib/utils";

interface DialogContainerProps {
  children: React.ReactNode;
  colors: Record<string, string>;
  className?: string;
}

export const DialogContainer = ({ children, colors, className }: DialogContainerProps) => {
  return (
    <div 
      className={cn(
        "relative flex flex-col pb-6 p-6 rounded-lg",
        "bg-gradient-to-br",
        colors.lightBg,
        colors.darkBg,
        className
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
        colors.gradientFrom,
        colors.gradientTo,
        colors.darkGradientFrom,
        colors.darkGradientTo
      )} />

      {/* Radial gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
      
      {/* Contenu du dialogue */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
