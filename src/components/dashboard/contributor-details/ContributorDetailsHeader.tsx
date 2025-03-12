import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
import { useState } from "react";

interface ContributorDetailsHeaderProps {
  name: string;
  isOwner: boolean;
  avatarUrl?: string | null;
  isDarkTheme?: boolean;
}

export function ContributorDetailsHeader({ 
  name, 
  isOwner, 
  avatarUrl,
  isDarkTheme: forceDarkTheme,
}: ContributorDetailsHeaderProps) {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);
  
  const isDarkTheme = forceDarkTheme !== undefined ? forceDarkTheme : theme === "dark";
  const initials = getInitials(name);
  const avatarColors = getAvatarColor(name, isDarkTheme);
  
  const bgColor = isOwner 
    ? (isDarkTheme ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.2)') 
    : avatarColors.background;
  
  const textColor = isOwner 
    ? (isDarkTheme ? 'rgb(251, 191, 36)' : 'rgb(217, 119, 6)') 
    : avatarColors.text;
  
  return (
    <div className={cn(
      "relative py-5 rounded-2xl mb-3",
      "bg-white/60 dark:bg-gray-800/40",
      "border border-amber-100/50 dark:border-amber-800/30",
      "shadow-sm"
    )}>
      <div className={cn(
        "absolute inset-0 rounded-2xl overflow-hidden",
        "pointer-events-none"
      )}>
        <div className={cn(
          "absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-10",
          "bg-gradient-to-br from-amber-400 to-amber-600",
          "dark:from-amber-500 dark:to-amber-700 dark:opacity-10"
        )} />
      </div>
      
      <div className="flex items-center space-x-4 relative z-10 px-5">
        <div className="relative">
          <Avatar className={cn(
            "h-14 w-14",
            "ring-2 ring-offset-2",
            isOwner 
              ? "ring-amber-300 dark:ring-amber-500/50 ring-offset-white dark:ring-offset-gray-800" 
              : "ring-transparent ring-offset-transparent",
            "transition-shadow hover:shadow-md"
          )}>
            {avatarUrl && !imageError ? (
              <AvatarImage 
                src={avatarUrl} 
                alt={name} 
                onError={() => setImageError(true)}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback 
              className={cn(
                "text-lg font-medium",
                isOwner && "bg-gradient-to-tr from-amber-500/80 via-amber-400/80 to-amber-500/80"
              )}
              style={{
                backgroundColor: bgColor,
                color: textColor,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          
          {isOwner && (
            <div className={cn(
              "absolute -top-1.5 -right-1.5",
              "text-amber-500 dark:text-amber-400",
              "bg-white dark:bg-gray-800",
              "border border-amber-200 dark:border-amber-700/50",
              "rounded-full p-0.5",
              "shadow-sm"
            )}>
              <Crown size={14} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h2 className={cn(
            "text-xl font-bold",
            "text-amber-700 dark:text-amber-300",
            "flex items-center space-x-2"
          )}>
            <span>{name}</span>
            {isOwner && (
              <span className={cn(
                "text-xs font-normal py-0.5 px-1.5 rounded-full",
                "bg-amber-100 text-amber-600",
                "dark:bg-amber-900/30 dark:text-amber-400",
                "border border-amber-200 dark:border-amber-700/50"
              )}>
                Propriétaire
              </span>
            )}
          </h2>
          <p className={cn(
            "text-sm mt-0.5",
            "text-amber-600/70 dark:text-amber-400/70"
          )}>
            {isOwner 
              ? "Vous êtes le propriétaire de ce budget" 
              : "Détails du contributeur"}
          </p>
        </div>
      </div>
    </div>
  );
}
