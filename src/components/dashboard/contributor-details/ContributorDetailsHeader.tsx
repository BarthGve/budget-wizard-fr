
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

export interface ContributorDetailsHeaderProps {
  name: string;
  isOwner: boolean;
  avatarUrl: string | null;
  isDarkTheme?: boolean;
}

export function ContributorDetailsHeader({ 
  name, 
  isOwner,
  avatarUrl,
  isDarkTheme 
}: ContributorDetailsHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={cn(
      "flex items-center justify-between py-3 px-6",
      "border-b",
      isDarkTheme
        ? "border-gray-700/50"
        : "border-quinary-100/70"
    )}>
      <div className="flex items-center space-x-4">
        {/* Avatar avec fallback */}
        <Avatar className={cn(
          "h-12 w-12 rounded-full border-2",
          isDarkTheme
            ? "border-quinary-500/30"
            : "border-quinary-200"
        )}>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback className={cn(
              "bg-gradient-to-br text-white font-medium text-lg",
              isDarkTheme
                ? "from-quinary-600 to-quinary-700"
                : "from-quinary-400 to-quinary-500"
            )}>
              {getInitials(name)}
            </AvatarFallback>
          )}
          {isOwner && (
            <div className={cn(
              "absolute -bottom-1 -right-1 rounded-full p-1",
              isDarkTheme
                ? "bg-quinary-600 text-black"
                : "bg-quinary-300 text-quinary-800"
            )}>
              <Crown className="h-3 w-3" />
            </div>
          )}
        </Avatar>
        
        {/* Nom et rôle */}
        <div>
          <h2 className={cn(
            "text-lg font-semibold",
            isDarkTheme
              ? "text-quinary-300"
              : "text-quinary-700"
          )}>
            {name}
          </h2>
          {isOwner && (
            <p className={cn(
              "text-xs",
              isDarkTheme
                ? "text-quinary-400/70"
                : "text-quinary-600/70"
            )}>
              Propriétaire du compte
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
