
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface VehicleFuelExpensesCardProps {
  totalFuelExpenses: number;
  fuelVolume?: number;
  fuelExpensesCount?: number;
  profile: Profile | null | undefined;
  viewMode: "monthly" | "yearly";
  hasActiveVehicles: boolean; // Nouvelle prop pour vérifier la présence de véhicules actifs
}

export const VehicleFuelExpensesCard = ({
  totalFuelExpenses,
  fuelVolume = 0,
  fuelExpensesCount = 0,
  profile,
  viewMode,
  hasActiveVehicles
}: VehicleFuelExpensesCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentMonthName = new Date().toLocaleString('fr-FR', {
    month: 'long'
  });
  const isPro = profile?.profile_type === 'pro';
  const titleText = "Carburant";
  const descriptionText = viewMode === "monthly" ? `Dépenses du mois de ${currentMonthName}` : `Dépenses de l'année ${new Date().getFullYear()}`;
  const averagePrice = fuelVolume > 0 ? totalFuelExpenses / fuelVolume : 0;

  // Contenu du tooltip avec les informations détaillées (uniquement pour les PRO)
  const tooltipContent = isPro && fuelVolume > 0 ? (
    <div className="space-y-2 py-1">
      <div className="flex justify-between items-center gap-4">
        <span>Volume total:</span>
        <span className="font-medium">{fuelVolume.toFixed(2)} L</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span>Prix moyen:</span>
        <span className="font-medium">{averagePrice.toFixed(3)} €/L</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span>Pleins:</span>
        <span className="font-medium">{fuelExpensesCount}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Inclut les véhicules actifs et vendus
      </div>
    </div>
  ) : null;

  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 10
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.4,
        delay: 0.1
      }} 
      whileHover={{
        y: -3
      }}
    >
      <Card 
        className={cn(
          "backdrop-blur-sm cursor-pointer transition-all duration-300 h-full relative overflow-hidden",
   "shadow-lg border hover:shadow-xl",
        )} 
        onClick={() => navigate("/vehicles")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {/* Modification: afficher l'icône même sur mobile */}
              <div 
                className={cn(
                  "p-2 rounded-full", 
                  "bg-gray-200 text-gray-600",
                  // Light mode - Gris au lieu de vert
                  "dark:bg-gray-700/40 dark:text-gray-300" // Dark mode - Gris au lieu de vert
                )}
              >
                <Fuel className="h-5 w-5" />
              </div>
              <span className="dark:text-white">{titleText}</span>
            </CardTitle>
          </div>
          <CardDescription className={cn("text-gray-500", "dark:text-gray-400")}>
            {descriptionText}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-4">
            {hasActiveVehicles ? (
              <motion.div 
                initial={{
                  scale: 0.9
                }} 
                animate={{
                  scale: 1
                }} 
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                }} 
                className="space-y-1"
              >
                {isPro && tooltipContent ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className={cn(
                          "text-xl font-bold leading-none cursor-help", 
                          "text-gray-800", 
                          "dark:text-gray-100"
                        )}>
                          {formatCurrency(totalFuelExpenses)}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="w-56">
                        {tooltipContent}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className={cn(
                    "text-xl font-bold leading-none", 
                    "text-gray-800", 
                    "dark:text-gray-100"
                  )}>
                    {formatCurrency(totalFuelExpenses)}
                  </p>
                )}
              </motion.div>
            ) : (
              // État affiché quand aucun véhicule actif n'est présent
              <div className="space-y-3">
                <div className="relative blur-sm pointer-events-none">
                  <p className={cn(
                    "text-xl font-bold leading-none", 
                    "text-gray-800", 
                    "dark:text-gray-100"
                  )}>
                    {formatCurrency(0)}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Ajoutez un véhicule pour suivre vos dépenses de carburant
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/vehicles");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Ajouter un véhicule
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
