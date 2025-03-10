
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

interface CreditCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  amount: number;
  subtitle: string;
  badgeText: string;
  colorScheme: "purple" | "green";
}

export const CreditCard = ({
  icon,
  title,
  description,
  amount,
  subtitle,
  badgeText,
  colorScheme = "purple"
}: CreditCardProps) => {
  // Choix des couleurs en fonction du schéma
  const colors = {
    purple: {
      // Light mode
      card: "bg-white border-purple-100",
      hover: "hover:bg-purple-900/20",
      darkBorder: "dark:border-purple-800/50",
      gradient: "from-purple-400 via-violet-300 to-transparent",
      darkGradient: "dark:from-purple-400 dark:via-violet-500 dark:to-transparent",
      icon: "bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300",
      title: "text-purple-700 dark:text-purple-300",
      description: "text-purple-600/80 dark:text-purple-400/90",
      badge: "bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300",
    },
    green: {
      // Light mode
      card: "bg-white border-green-100",
      hover: "hover:bg-green-900/20",
      darkBorder: "dark:border-green-800/50",
      gradient: "from-green-400 via-emerald-300 to-transparent",
      darkGradient: "dark:from-green-400 dark:via-emerald-500 dark:to-transparent",
      icon: "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300",
      title: "text-green-700 dark:text-green-300",
      description: "text-green-600/80 dark:text-green-400/90",
      badge: "bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300",
    }
  };

  const currentColors = colors[colorScheme];

  return (
    <motion.div
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 }
      }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 h-full relative",
        "border shadow-sm hover:shadow-md",
        // Light mode
        currentColors.card,
        // Dark mode
        `dark:bg-gray-800/90 dark:${currentColors.hover} ${currentColors.darkBorder}`
      )}>
        {/* Fond radial gradient */}
        <div className={cn(
          "absolute inset-0 opacity-5",
          // Light mode
          `bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${currentColors.gradient}`,
          // Dark mode
          `dark:opacity-10 ${currentColors.darkGradient}`
        )} />
        
        <CardHeader className="pb-2 pt-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={cn(
                // Common
                "p-2 rounded-lg",
                // Couleurs spécifiques
                currentColors.icon
              )}>
                {icon}
              </div>
              <CardTitle className={cn(
                "text-lg font-semibold",
                currentColors.title
              )}>
                {title}
              </CardTitle>
            </div>
          </div>
          
          <CardDescription className={cn(
            "mt-2 text-sm",
            currentColors.description
          )}>
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-1 pb-6 relative z-10">
          <p className={cn(
            "text-2xl font-bold",
            currentColors.title
          )}>
            {amount.toLocaleString('fr-FR')} €
          </p>
          <p className={cn(
            "text-sm mt-1",
            currentColors.description
          )}>
            {subtitle}
            <span className={cn(
              "ml-2 inline-block text-xs py-0.5 px-2 rounded-full",
              currentColors.badge
            )}>
              {badgeText}
            </span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
