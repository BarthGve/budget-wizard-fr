import { Contributor } from "@/types/contributor";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributorTableRowProps {
  contributor: Contributor;
  expenseShare: number;
  creditShare: number;
  isDarkTheme: boolean;
  avatarUrl?: string | null;
  onSelect: (contributor: Contributor) => void;
}

export function ContributorTableRow({
  contributor,
  expenseShare,
  creditShare,
  isDarkTheme,
  avatarUrl,
  onSelect,
}: ContributorTableRowProps) {
  const initials = getInitials(contributor.name);
  const avatarColors = getAvatarColor(contributor.name, isDarkTheme);
  
  // Utiliser une valeur par défaut pour percentage_contribution
  const percentageContribution = contributor.percentage_contribution ?? 0;
  
  // Formater les nombres avec virgule pour le format français
  const formatNumber = (value: number, decimals = 2) => 
    value.toFixed(decimals).replace('.', ',');
  
  return (
    <TableRow 
      className={cn(
        "cursor-pointer transition-colors duration-200",
        "hover:bg-amber-50/40 dark:hover:bg-amber-900/10",
        contributor.is_owner && "bg-amber-50/30 dark:bg-amber-900/5"
      )}
      onClick={() => {
        onSelect({
          ...contributor,
          expenseShare,
          creditShare
        });
      }}
    >
      <TableCell className="font-medium">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className={cn(
              "h-10 w-10 ring-2",
              contributor.is_owner 
                ? "ring-amber-300 dark:ring-amber-500" 
                : "ring-amber-100 dark:ring-amber-800/30"
            )}>
              {avatarUrl && (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={contributor.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold",
                  "border border-amber-200/50 dark:border-amber-800/30"
                )}
                style={{
                  backgroundColor: avatarColors.background,
                  color: avatarColors.text,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {contributor.is_owner && (
              <div className={cn(
                "absolute -bottom-1 -right-1",
                "bg-amber-400 dark:bg-amber-500",
                "rounded-full p-0.5",
                "border-2 border-white dark:border-gray-800",
                "shadow-sm"
              )}>
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <div className="font-medium text-amber-800 dark:text-amber-300">
              {contributor.name}
            </div>
            {contributor.is_owner && (
              <div className="text-xs text-amber-600/70 dark:text-amber-400/70">
                Propriétaire
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className={cn(
        "text-right",
        "font-medium",
        "text-amber-700 dark:text-amber-400"
      )}>
        {formatNumber(contributor.total_contribution)} €
      </TableCell>
      
      <TableCell className={cn(
        "text-right",
        "font-medium",
        "text-amber-600 dark:text-amber-500"
      )}>
        <span className={cn(
          "px-2 py-1 rounded-full",
          "bg-amber-100/70 dark:bg-amber-900/30",
          "text-xs font-medium"
        )}>
          {formatNumber(percentageContribution, 1)}%
        </span>
      </TableCell>
      
      <TableCell className={cn(
        "text-right",
        "text-amber-700 dark:text-amber-400"
      )}>
        {formatNumber(expenseShare)} €
      </TableCell>
      
      <TableCell className={cn(
        "text-right",
        "text-amber-700 dark:text-amber-400"
      )}>
        {formatNumber(creditShare)} €
      </TableCell>
    </TableRow>
  );
}
