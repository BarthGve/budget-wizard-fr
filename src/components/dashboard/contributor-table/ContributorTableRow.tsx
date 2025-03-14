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
        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        contributor.is_owner && "bg-gray-50/70 dark:bg-gray-800/30"
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
              "h-9 w-9 ring-1",
              contributor.is_owner 
                ? "ring-amber-300 dark:ring-amber-500" 
                : "ring-gray-200 dark:ring-gray-700"
            )}>
              {contributor.is_owner && avatarUrl ? (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={contributor.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback
                className="border border-gray-200/50 dark:border-gray-700/50"
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
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {contributor.name}
            </div>
            {contributor.is_owner && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Propriétaire
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="text-center font-medium">
        {formatNumber(contributor.total_contribution)} €
      </TableCell>
      
      <TableCell className="text-center">
        <span className={cn(
          "px-2 py-1 rounded-full",
          "bg-gray-100 dark:bg-gray-800",
          "text-xs font-medium"
        )}>
          {formatNumber(percentageContribution, 1)}%
        </span>
      </TableCell>
      
      <TableCell className="text-center">
        {formatNumber(expenseShare)} €
      </TableCell>
      
      <TableCell className="text-center">
        {formatNumber(creditShare)} €
      </TableCell>
    </TableRow>
  );
}
