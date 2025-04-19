
import { Card } from "@/components/ui/card";
import { Contributor } from "@/types/contributor";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface ContributorsMobileCardProps {
  contributors: Array<Contributor>;
  onSelectContributor?: (contributor: Contributor) => void;
}

export const ContributorsMobileCard = ({ 
  contributors,
  onSelectContributor
}: ContributorsMobileCardProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  if (!contributors || contributors.length === 0) return null;

  const handleContributorClick = (contributor: Contributor) => {
    if (onSelectContributor) {
      onSelectContributor(contributor);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      <Card className={cn(
        "overflow-hidden shadow-md",
        "bg-white border border-gray-100",
        "dark:bg-gray-900/95 dark:border-gray-800"
      )}>
        {/* En-tête */}
        <div className={cn(
          "px-4 py-3 border-b flex items-center gap-2",
          "border-quinary-100 bg-gradient-to-r from-quinary-50/90 to-quinary-50/60",
          "dark:border-quinary-900/20 dark:bg-gradient-to-r dark:from-quinary-900/20 dark:to-quinary-900/10"
        )}>
          <div className={cn(
            "p-1.5 rounded-full",
            "bg-quinary-100/90",
            "dark:bg-quinary-800/30"
          )}>
            <Users className={cn(
              "h-4 w-4", 
              "text-quinary-600/80", 
              "dark:text-quinary-400/90"
            )} />
          </div>
          <h3 className={cn(
            "text-lg font-medium",
            "dark:text-white"
          )}>
            Contributeurs
          </h3>
        </div>
        
        {/* Liste des contributeurs */}
        <div className="px-4 py-3 divide-y divide-gray-100 dark:divide-gray-800">
          {contributors.map((contributor) => (
            <div 
              key={contributor.id} 
              className={cn(
                "py-3 flex justify-between items-center",
                "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
              onClick={() => handleContributorClick(contributor)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  isDarkTheme ? "bg-quinary-800/30 text-quinary-200" : "bg-quinary-100 text-quinary-800"
                )}>
                  {contributor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{contributor.name}</div>
                  {contributor.is_owner && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Propriétaire
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {contributor.total_contribution} €
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {contributor.percentage_contribution.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
