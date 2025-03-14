import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ContributorAvatarProps {
  name: string;
  avatarUrl?: string | null;
  isOwner: boolean;
  isDarkTheme?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ContributorAvatar = ({ 
  name, 
  avatarUrl, 
  isOwner,
  isDarkTheme = false,
  size = 'md',
  className
}: ContributorAvatarProps) => {
  const [imageError, setImageError] = useState(false);
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
          : "ring-transparent ring-offset-transparent",
        "transition-shadow hover:shadow-md",
        className
      )}
    >
      {avatarUrl && !imageError ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={name} 
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : null}
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
