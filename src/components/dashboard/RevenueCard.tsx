import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from 'lucide-react';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
        className="bg-gradient-to-br from-background to-amber-50 backdrop-blur-sm shadow-lg border border-amber-100 cursor-pointer h-[190px] flex flex-col"
        onClick={() => navigate("/income")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Banknote className="h-6 w-6 text-amber-500" />
              Revenus
            </CardTitle>
          </div>
          <CardDescription>Des contributeurs</CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <motion.p 
              className="font-bold text-xl leading-none text-gray-800"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {displayedRevenue.toLocaleString('fr-FR')} €
            </motion.p>
            
          
          </div>
          
          {/* Espace réservé pour maintenir la hauteur cohérente */}
          <div className="text-xs text-muted-foreground mt-auto">
            {!contributorShares || contributorShares.length === 0 ? 
              "Cliquez pour voir le détail des revenus" : ""}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
