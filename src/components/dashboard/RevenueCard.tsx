import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from 'lucide-react';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ContributorShare {
  name: string;
  start: number;
  end: number;
  amount: number;
}

interface RevenueCardProps {
  totalRevenue: number;
  contributorShares: ContributorShare[];
}

export const RevenueCard = ({
  totalRevenue,
  contributorShares
}: RevenueCardProps) => {
  const [displayedRevenue, setDisplayedRevenue] = useState(totalRevenue);
  const navigate = useNavigate();

  // Mettre à jour directement sans animation complexe
  useEffect(() => {
    setDisplayedRevenue(totalRevenue);
  }, [totalRevenue]);

  // Utiliser le Hook navigate de React Router pour une navigation SPA
  const handleCardClick = () => {
    navigate("/contributors");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card 
        className={cn(
          "backdrop-blur-sm cursor-pointer transition-all duration-300",
          // Light mode styles
          "bg-primary/10 shadow-lg border border-primary/20 hover:shadow-xl",
          // Dark mode styles
          "dark:bg-primary/10 dark:border-primary/30 dark:shadow-primary/30 dark:hover:shadow-primary/50"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-primary/20 text-primary", // Light mode
                "dark:bg-primary/20 dark:text-primary" // Dark mode
              )}>
                <Banknote className="h-5 w-5" />
              </div>
              <span className="dark:text-white">Revenus</span>
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "text-gray-500",
            "dark:text-gray-400"
          )}>Des contributeurs</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p 
                className={cn(
                  "font-bold text-xl leading-none",
                  "text-gray-800", // Light mode
                  "dark:text-primary" // Dark mode - couleur primary pour correspondre à l'effet voulu
                )}
              >
                {displayedRevenue.toLocaleString('fr-FR')} €
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};