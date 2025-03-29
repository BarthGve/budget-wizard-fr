
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
  className?: string;
  showText?: boolean;
};

// Détermine les classes CSS pour le statut du véhicule
export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'actif':
      return {
        badge: "bg-gradient-to-r from-green-50/80 to-green-100/70 dark:from-green-900/20 dark:to-green-800/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/40",
        indicator: "bg-green-500"
      };
    case 'inactif':
      return {
        badge: "bg-gradient-to-r from-amber-50/80 to-amber-100/70 dark:from-amber-900/20 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
        indicator: "bg-amber-500"
      };
    case 'vendu':
      return {
        badge: "bg-gradient-to-r from-gray-50/80 to-gray-100/70 dark:from-gray-800/20 dark:to-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700/40",
        indicator: "bg-gray-500"
      };
    default:
      return {
        badge: "bg-gradient-to-r from-gray-50/80 to-gray-100/70 dark:from-gray-800/20 dark:to-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700/40",
        indicator: "bg-gray-500"
      };
  }
};

export const StatusBadge = ({ status, className, showText = true }: StatusBadgeProps) => {
  const statusStyles = getStatusBadgeStyles(status);
  
  return (
    <Badge 
      className={cn(
        "px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm border",
        statusStyles.badge,
        className
      )}
      variant="outline"
    >
      <span className={cn(
        "w-2 h-2 rounded-full",
        statusStyles.indicator
      )} />
      {showText && status === 'actif' && "Actif"}
      {showText && status === 'inactif' && "Inactif"}
      {showText && status === 'vendu' && "Vendu"}
    </Badge>
  );
};
