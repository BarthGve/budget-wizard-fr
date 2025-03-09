import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard as CreditCardIcon, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CreditCardProps {
  totalMensualites: number;
  totalRevenue: number;
}

export const CreditCard = ({
  totalMensualites,
  totalRevenue
}: CreditCardProps) => {
  const navigate = useNavigate();
  const tauxEndettement = totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
  
  const getBadgeVariant = (taux: number) => {
    if (taux < 30) return "default";
    if (taux < 40) return "secondary";
    return "destructive";
  };
  
  const getStatusIcon = (taux: number) => {
    if (taux < 30) return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
    if (taux < 40) return <Info className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
    return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
  };
  
  const getStatusText = (taux: number) => {
    if (taux < 30) return "Sain";
    if (taux < 40) return "Attention";
    return "Critique";
  };
  
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  
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
          "bg-gradient-to-br from-background to-purple-50 shadow-lg border border-purple-100",
          // Dark mode styles
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-purple-950 dark:border-purple-900/50 dark:shadow-purple-900/10"
        )}
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-purple-100 text-purple-600", // Light mode
                "dark:bg-purple-900/40 dark:text-purple-400" // Dark mode
              )}>
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <span className="dark:text-white">Crédits</span>
            </CardTitle>
            <Badge 
              variant={getBadgeVariant(tauxEndettement)} 
              className={cn(
                "px-3 py-1 flex items-center gap-1",
                // Améliorer la visibilité des badges en dark mode
                "dark:bg-opacity-90 dark:font-medium"
              )}
            >
              {getStatusIcon(tauxEndettement)}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <span className="text-sm">{Math.round(tauxEndettement)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700">
                  <p className="flex items-center gap-1 dark:text-white">
                    <Info className="h-4 w-4" />
                    Taux d'endettement mensuel
                  </p>
                </TooltipContent>
              </Tooltip>
            </Badge>
          </div>
          <CardDescription className={cn(
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Total dû en {currentMonthName}
          </CardDescription>
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
                    "text-xl font-bold leading-none",
                    "text-gray-800", // Light mode
                    "dark:text-purple-100" // Dark mode - légèrement teinté de violet pour l'effet visuel
                  )}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  {Math.round(totalMensualites).toLocaleString('fr-FR')} €
                </motion.p>
                
                {/* Effet de lueur subtil - visible uniquement en dark mode */}
                <div className="absolute -inset-1 bg-purple-500/10 blur-md rounded-full opacity-0 dark:opacity-60" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
