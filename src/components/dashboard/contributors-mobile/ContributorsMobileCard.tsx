
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { Contributor } from "@/types/contributor";
import { useTheme } from "next-themes";

interface ContributorsMobileCardProps {
  contributors: Contributor[];
}

export const ContributorsMobileCard = ({ contributors }: ContributorsMobileCardProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "overflow-hidden shadow-lg",
        // Light mode styling
        "bg-white border border-gray-100",
        // Dark mode styling
        "dark:bg-gray-900/95 dark:border-gray-800 dark:shadow-lg dark:shadow-gray-900/30"
      )}>
        {/* En-tête stylisé avec titre et icône - fond jaune subtil */}
        <div className={cn(
          "px-4 py-3 border-b flex items-center gap-2",
          // Light mode styling avec fond jaune subtil dégradé
          "border-amber-100 bg-gradient-to-r from-amber-50/90 to-amber-50/60",
          // Dark mode styling avec fond jaune subtil plus sombre
          "dark:border-amber-900/20 dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-amber-900/10"
        )}>
          <div className={cn(
            "p-1.5 rounded-full",
            // Light mode - fond légèrement teinté jaune
            "bg-amber-100/90",
            // Dark mode - fond ambré sombre
            "dark:bg-amber-800/30"
          )}>
            <Users className={cn(
              "h-4 w-4", 
              "text-amber-600/80", 
              "dark:text-amber-400/90"
            )} />
          </div>
          <div className="flex justify-between items-center w-full">
            <h3 className={cn(
              "text-lg font-medium",
              "dark:text-white"
            )}>
              Contributeurs
            </h3>
            <span className={cn(
              "text-sm font-medium rounded-full px-2 py-0.5",
              "bg-amber-100 text-amber-800",
              "dark:bg-amber-900/30 dark:text-amber-300"
            )}>
              {contributors.length}
            </span>
          </div>
        </div>
        
        {/* Corps de la carte avec avatars et noms */}
        <div className="p-4">
          <div className="space-y-3">
            {contributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center gap-3">
                <ContributorAvatar 
                  name={contributor.name} 
                  isOwner={contributor.is_owner}
                  isDarkTheme={isDarkTheme}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className={cn(
                    "font-medium",
                    "dark:text-white"
                  )}>
                    {contributor.name}
                  </span>
                  <span className={cn(
                    "text-xs",
                    "text-gray-500",
                    "dark:text-gray-400"
                  )}>
                    {contributor.total_contribution.toLocaleString('fr-FR')} € / mois
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Composant d'avatar réutilisable pour afficher l'avatar du contributeur
const ContributorAvatar = ({ 
  name, 
  isOwner,
  isDarkTheme,
  size = 'md'
}: { 
  name: string; 
  isOwner: boolean;
  isDarkTheme: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const initials = getInitials(name);
  const avatarColors = getAvatarColor(name, isDarkTheme);
  
  // Si c'est le propriétaire, on utilise des couleurs spécifiques pour le distinguer
  const bgColor = isOwner 
    ? (isDarkTheme ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.2)') 
    : avatarColors.background;
  
  const textColor = isOwner 
    ? (isDarkTheme ? 'rgb(251, 191, 36)' : 'rgb(217, 119, 6)') 
    : avatarColors.text;
  
  // Tailles dynamiques basées sur le prop size
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base"
  };

  return (
    <Avatar 
      className={cn(
        sizeClasses[size],
        "ring-2 ring-offset-2",
        isOwner 
          ? "ring-amber-300 dark:ring-amber-500/50 ring-offset-white dark:ring-offset-gray-800" 
          : "ring-transparent ring-offset-transparent"
      )}
    >
      <AvatarFallback 
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        className={cn(
          "font-medium",
          // Ajout d'une subtile animation de gradient pour les propriétaires
          isOwner && "bg-gradient-to-tr from-amber-500/80 via-amber-400/80 to-amber-500/80"
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
