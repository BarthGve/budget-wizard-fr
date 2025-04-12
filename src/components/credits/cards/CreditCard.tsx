
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
  subtitle: ReactNode;
  badgeText: string;
  colorScheme: "primary" | "green" | "blue";
  children?: ReactNode;
}

export const CreditCard = ({
  icon,
  title,
  description,
  amount,
  subtitle,
  badgeText,
  colorScheme = "blue",
  children
}: CreditCardProps) => {
  // Couleurs pour la barre de progression en fonction du schéma
  const colors = {
    primary: {
      // Light mode
      card: "bg-white border-primary-100",
      darkBorder: "dark:border-primary-800/50",
      gradient: "from-primary-400 via-primary-300 to-transparent",
      darkGradient: "dark:from-primary-400 dark:via-primary-500 dark:to-transparent",
      icon: "bg-primary-100 text-primary-700 dark:bg-primary-800/40 dark:text-primary-300",
      title: "text-primary-900 dark:text-primary-300",
      amount: "text-primary-800 dark:text-primary-200",
      description: "text-primary-600/80 dark:text-primary-400/90",
      badge: "bg-primary-100 dark:bg-primary-800/40 text-primary-700 dark:text-primary-300",
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
        "border shadow-lg ",
        // Light mode - garde le fond blanc
        "bg-white",
        "border-gray-100",
        // Dark mode - alignées avec les cards de graphiques
        "dark:bg-gray-800/90  dark:shadow-primary-800/30 ", 
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
        
        {/* Le subtitle peut être un string ou un ReactNode */}
        {typeof subtitle === 'string' ? (
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
        ) : (
          <div className={cn(
            "text-sm mt-1",
            currentColors.description
          )}>
            {/* Rendu du ReactNode avec le badge à l'intérieur */}
            {
              typeof subtitle === 'object' && subtitle !== null 
                ? subtitle 
                : (
                  <>
                    {subtitle}
                    <span className={cn(
                      "ml-2 inline-block text-xs py-0.5 px-2 rounded-full badge",
                      currentColors.badge
                    )}>
                      {badgeText}
                    </span>
                  </>
                )
            }
          </div>
        )}
        
        {/* Affichage du contenu enfant s'il existe */}
        {children}
      </CardContent>
    </Card>
  );
};
