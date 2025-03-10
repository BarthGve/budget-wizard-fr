
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="flex items-start">
      <div className={cn(
        "w-9 h-9 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0",
        // Light mode
        "bg-gray-100 text-blue-500",
        // Dark mode
        "dark:bg-gray-800 dark:text-blue-400"
      )}>
        {icon}
      </div>
      
      <div className="ml-3 flex-1">
        <div className={cn(
          "text-sm",
          // Light mode
          "text-gray-500",
          // Dark mode
          "dark:text-gray-400"
        )}>
          {label}
        </div>
        <div className={cn(
          "font-medium mt-0.5",
          // Light mode
          "text-gray-800",
          // Dark mode
          "dark:text-gray-200"
        )}>
          {value}
        </div>
      </div>
    </div>
  );
};
