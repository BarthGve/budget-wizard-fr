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

  // Mettre à jour le montant affiché lorsque totalRevenue change
  useEffect(() => {
    if (totalRevenue !== displayedRevenue) {
      // Animation simple d'interpolation numérique par centaine
      const startValue = displayedRevenue;
      const endValue = totalRevenue;
      const duration = 800; // ms
      const startTime = Date.now();

      const animateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed >= duration) {
          setDisplayedRevenue(endValue);
          return;
        }
        
        const progress = elapsed / duration;
        // Calculer la valeur intermédiaire et arrondir par centaine
        const rawValue = startValue + (endValue - startValue) * progress;
        const currentValue = Math.round(rawValue / 100) * 100; // Arrondi à la centaine
        setDisplayedRevenue(currentValue);
        requestAnimationFrame(animateValue);
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [totalRevenue, displayedRevenue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card 
        className={cn(
          "backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl",
          // Light mode styles
          "bg-gradient-to-br from-background to-amber-50 shadow-lg border border-amber-100",
          // Dark mode styles
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-amber-950 dark:border-amber-900/50 dark:shadow-amber-900/10"
        )}
        onClick={() => navigate("/contributors")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-amber-100 text-amber-600", // Light mode
                "dark:bg-amber-900/40 dark:text-amber-400" // Dark mode
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
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p 
                  className={cn(
                    "font-bold text-xl leading-none",
                    "text-gray-800", // Light mode
                    "dark:text-amber-100" // Dark mode - légèrement teinté d'ambre pour l'effet visuel
                  )}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  {displayedRevenue.toLocaleString('fr-FR')} €
                </motion.p>
                
                {/* Effet de lueur sous le montant - visible uniquement en dark mode */}
                <div className="absolute -inset-1 bg-amber-500/10 blur-md rounded-full opacity-0 dark:opacity-60" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
