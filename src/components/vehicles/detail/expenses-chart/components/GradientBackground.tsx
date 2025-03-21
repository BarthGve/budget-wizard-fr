
import { cn } from "@/lib/utils";

export const GradientBackground = () => {
  return (
    <div className={cn(
      "absolute inset-0 opacity-5",
      // Light mode
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-400 via-gray-300 to-transparent",
      // Dark mode
      "dark:opacity-10 dark:from-gray-400 dark:via-gray-500 dark:to-transparent"
    )} />
  );
};
