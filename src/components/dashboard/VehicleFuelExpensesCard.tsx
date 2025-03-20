
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";

interface VehicleFuelExpensesCardProps {
  totalFuelExpenses: number;
  profile: Profile | null | undefined;
  viewMode: "monthly" | "yearly";
}

export const VehicleFuelExpensesCard = ({
  totalFuelExpenses,
  profile,
  viewMode
}: VehicleFuelExpensesCardProps) => {
  const navigate = useNavigate();
  const currentMonthName = new Date().toLocaleString('fr-FR', {
    month: 'long'
  });
  
  const isPro = profile?.profile_type === 'pro';
  
  const titleText = "Carburant";
  const descriptionText = viewMode === "monthly" 
    ? `Dépenses du mois de ${currentMonthName}` 
    : `Dépenses de l'année ${new Date().getFullYear()}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, delay: 0.1 }} 
      whileHover={{ y: -3 }}
    >
      <Card 
        className={cn(
          "backdrop-blur-sm cursor-pointer transition-all duration-300 h-full relative overflow-hidden",
          // Light mode styles - Gris au lieu de vert
          "bg-gradient-to-br from-background to-gray-100 shadow-lg border border-gray-200 hover:shadow-xl",
          // Dark mode styles - Gris au lieu de vert
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border-gray-700/30 dark:shadow-gray-800/30 dark:hover:shadow-gray-800/50"
        )} 
        onClick={() => navigate("/vehicles")}
      >
        {/* Flou pour les utilisateurs non-pro */}
        {!isPro && (
          <div className="absolute inset-0 backdrop-blur-sm bg-white/50 dark:bg-black/60 z-10 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/90 dark:bg-primary/80 text-white p-3 rounded-full mb-3">
              <Fuel className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1 dark:text-white">Fonctionnalité PRO</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Passez au compte PRO pour accéder au suivi des dépenses carburant
            </p>
          </div>
        )}
        
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full", 
                "bg-gray-200 text-gray-600",
                // Light mode - Gris au lieu de vert
                "dark:bg-gray-700/40 dark:text-gray-300" // Dark mode - Gris au lieu de vert
              )}>
                <Fuel className="h-5 w-5" />
              </div>
              <span className="dark:text-white">{titleText}</span>
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "text-gray-500", 
            "dark:text-gray-400"
          )}>
            {descriptionText}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <motion.p 
              className={cn(
                "text-xl font-bold leading-none", 
                "text-gray-800",
                // Light mode
                "dark:text-gray-100" // Dark mode - Gris au lieu de vert
              )} 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {formatCurrency(totalFuelExpenses)}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
