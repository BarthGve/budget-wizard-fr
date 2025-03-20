
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
}

export const VehicleFuelExpensesCard = ({
  totalFuelExpenses,
  profile,
}: VehicleFuelExpensesCardProps) => {
  const navigate = useNavigate();
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  const isPro = profile?.profile_type === 'pro';

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
          // Light mode styles
          "bg-gradient-to-br from-background to-green-50 shadow-lg border border-green-100 hover:shadow-xl",
          // Dark mode styles - alignées avec les cards de graphiques
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-green-950 dark:border-green-900/30 dark:shadow-green-800/30 dark:hover:shadow-green-800/50"
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
                "bg-green-100 text-green-600", // Light mode
                "dark:bg-green-900/40 dark:text-green-400" // Dark mode
              )}>
                <Fuel className="h-5 w-5" />
              </div>
              <span className="dark:text-white">Carburant</span>
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Dépenses du mois de {currentMonthName}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <motion.p 
              className={cn(
                "text-xl font-bold leading-none",
                "text-gray-800", // Light mode
                "dark:text-green-100" // Dark mode
              )}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {formatCurrency(totalFuelExpenses)}
            </motion.p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tous véhicules confondus
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
