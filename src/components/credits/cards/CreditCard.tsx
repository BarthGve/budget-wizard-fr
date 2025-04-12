
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
  colorScheme: "primary" | "quaternary" | "tertiary";
  children?: ReactNode;
}

export const CreditCard = ({
  icon,
  title,
  description,
  amount,
  subtitle,
  badgeText,
  colorScheme = "tertiary",
  children
}: CreditCardProps) => {
  // Couleurs pour la barre de progression en fonction du schéma
  const colors = {
    primary: {
      // Light mode
  card: "bg-white border border-primary dark:border-primary",
  icon: "bg-primary/10 text-primary",
  title: "text-primary ",
  amount: "text-primary ",
  description: "text-foreground ",
  badge: "bg-primary/30 text-primary"

    },
    quaternary: {
      // Light mode
      card: "bg-white border border-quaternary dark:border-quaternary",
  icon: "bg-quaternary/10 text-quaternary",
  title: "text-quaternary ",
  amount: "text-quaternary ",
  description: "text-foreground ",
  badge: "bg-quaternary/30 text-quaternary"
    },
    tertiary: {
      // Light mode
      card: "bg-white border border-tertiary dark:border-tertiary",
  icon: "bg-tertiary/10 text-tertiary",
  title: "texttertiary ",
  amount: "text-tertiary ",
  description: "text-foreground ",
  badge: "bg-tertiary/30 text-tertiary"
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
