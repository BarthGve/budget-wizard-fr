
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

interface MileageProgressCardProps {
  data: {
    currentMileage: number;
    yearStart: number;
    yearProgress: number;
  };
  mileageLimit: number;
}

export const MileageProgressCard: React.FC<MileageProgressCardProps> = ({ 
  data, 
  mileageLimit 
}) => {
  const { currentMileage, yearStart, yearProgress } = data;
  
  // Calcul du kilométrage attendu à ce stade de l'année
  const expectedMileageAtThisPoint = Math.round(yearStart + (mileageLimit * (yearProgress / 100)));
  
  // Calcul du pourcentage d'utilisation du kilométrage annuel
  const mileageUsedSoFar = currentMileage - yearStart;
  const mileagePercentage = Math.min(Math.round((mileageUsedSoFar / mileageLimit) * 100), 100);
  
  // Calcul de la différence entre le kilométrage actuel et celui attendu
  const mileageDifference = currentMileage - expectedMileageAtThisPoint;
  const isAhead = mileageDifference > 0;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" /> 
          Suivi du kilométrage annuel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{mileagePercentage}% de {mileageLimit} km</span>
            </div>
            <Progress value={mileagePercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Année en cours</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold tabular-nums">{mileageUsedSoFar} km</span>
                <span className="text-xs text-muted-foreground">parcourus</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Progression de l'année</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold tabular-nums">{yearProgress}%</span>
                <span className="text-xs text-muted-foreground">écoulés</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            className={`p-3 rounded-md ${isAhead 
              ? 'bg-red-500/10 border border-red-500/20 dark:bg-red-900/30' 
              : 'bg-green-500/10 border border-green-500/20 dark:bg-green-900/30'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              {isAhead ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Vous êtes en avance de {Math.abs(mileageDifference)} km sur vos prévisions
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Vous disposez encore d'une marge de {Math.abs(mileageDifference)} km
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
