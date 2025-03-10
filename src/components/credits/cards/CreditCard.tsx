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
  colorScheme: "purple" | "green" | "blue";  // Ajout du schéma bleu
}

export const CreditCard = ({
  icon,
  title,
  description,
  amount,
  subtitle,
  badgeText,
  colorScheme = "blue"  // Par défaut bleu maintenant
}: CreditCardProps) => {
  // Choix des couleurs en fonction du schéma
  const colors = {
    purple: {
      // Light mode
      card: "bg-white border-purple-100",
      darkBorder: "dark:border-purple-800/50",
      gradient: "from-purple-400 via-violet-300 to-transparent",
      darkGradient: "dark:from-purple-400 dark:via-violet-500 dark:to-transparent",
      icon: "bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300",
      title: "text-purple-900 dark:text-purple-300",
      amount: "text-purple-800 dark:text-purple-200",
      description: "text-purple-600/80 dark:text-purple-400/90",
      badge: "bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300",
    },
    green: {
      // Light mode
      card: "bg-white border-green-100",
      darkBorder: "dark:border-green-800/50",
      gradient: "from-green-400 via-emerald-300 to-transparent",
      darkGradient: "dark:from-green-400 dark:via-emerald-500 dark:to-transparent",
      icon: "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300",
      title: "text-green-900 dark:text-green-300",
      amount: "text-green-800 dark:text-green-200",
      description: "text-green-600/80 dark:text-green-400/90",
      badge: "bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300",
    },
    blue: {
      // Light mode
      card: "bg-white border-blue-100",
      darkBorder: "dark:border-blue-800/50",
      gradient: "from-blue-400 via-sky-300 to-transparent",
      darkGradient: "dark:from-blue-400 dark:via-sky-500 dark:to-transparent",
      icon: "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300",
      title: "text-blue-900 dark:text-blue-300",
      amount: "text-blue-800 dark:text-blue-200",
      description: "text-blue-600/80 dark:text-blue-400/90",
      badge: "bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300",
    }
  };

  const currentColors = colors[colorScheme];

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 h-full relative",
        "border shadow-sm hover:shadow-md hover:translate-y-[-5px]",
        // Light mode - garde le fond blanc
        "bg-white",
        "border-gray-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:hover:bg-gray-800/70", 
        currentColors.darkBorder
      )}
    >
      {/* Fond radial gradient ultra-subtil */}
      <div className={cn(
        "absolute inset-0",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
        "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]"
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
          // Utilisation de la couleur amount dédiée pour le montant
          currentColors.amount
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
  );
};
