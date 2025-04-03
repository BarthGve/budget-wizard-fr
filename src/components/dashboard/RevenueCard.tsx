import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    if (totalRevenue !== displayedRevenue) {
      const startValue = displayedRevenue;
      const endValue = totalRevenue;
      const duration = 800;
      const startTime = Date.now();

      const animateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed >= duration) {
          setDisplayedRevenue(endValue);
          return;
        }
        
        const progress = elapsed / duration;
        const rawValue = startValue + (endValue - startValue) * progress;
        const currentValue = Math.round(rawValue / 100) * 100;
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
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <Card 
        className={cn(
          "backdrop-blur-lg cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-background/90 to-amber-50/90 shadow-md hover:shadow-lg border-amber-100/50",
          "dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-amber-950/90 dark:border-amber-800/20 dark:shadow-amber-900/20"
        )}
        onClick={() => navigate("/contributors")}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                "bg-amber-100 text-amber-600",
                "dark:bg-amber-900/50 dark:text-amber-300"
              )}>
                <Banknote className="h-4 w-4" />
              </div>
              <span className="dark:text-white">Revenus</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <motion.p 
              className={cn(
                "font-bold text-2xl",
                "text-gray-800",
                "dark:text-amber-50"
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            >
              {displayedRevenue.toLocaleString('fr-FR')} €
            </motion.p>
            
            <div className="absolute -inset-1 bg-amber-500/10 blur-md rounded-full opacity-0 dark:opacity-40" />
            
            <p className={cn(
              "text-xs mt-1",
              "text-gray-500",
              "dark:text-gray-400"
            )}>
              Des contributeurs
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};