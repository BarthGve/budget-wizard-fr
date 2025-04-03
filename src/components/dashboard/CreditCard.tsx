import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";

interface CreditCardProps {
  totalMensualites: number;
  totalRevenue: number;
  currentView?: "monthly" | "yearly";
}

export const CreditCard = ({
  totalMensualites,
  totalRevenue,
  currentView = "monthly"
}: CreditCardProps) => {
  const navigate = useNavigate();
  
  const { data: credits = [] } = useQuery({
    queryKey: ["credits-for-dashboard"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq('profile_id', user.id)
        .eq('statut', 'actif');
      
      if (error) {
        console.error("Erreur lors du chargement des crédits:", error);
        return [];
      }
      
      return data as Credit[];
    },
    staleTime: 1000 * 60 * 5,
  });
  
  const totalAmount = useMemo(() => {
    if (currentView === "monthly") {
      return totalMensualites;
    } else {
      const currentYear = new Date().getFullYear();
      const lastDayOfYear = new Date(currentYear, 11, 31);
      const today = new Date();
      
      return credits.reduce((total, credit) => {
        const derniereMensualite = new Date(credit.date_derniere_mensualite);
        
        if (derniereMensualite.getFullYear() === currentYear) {
          const moisRestants = (derniereMensualite.getMonth() - today.getMonth()) + 1;
          return total + (credit.montant_mensualite * Math.max(0, moisRestants));
        } else if (derniereMensualite > lastDayOfYear) {
          const moisRestants = 12 - today.getMonth();
          return total + (credit.montant_mensualite * moisRestants);
        }
        
        return total;
      }, 0);
    }
  }, [totalMensualites, credits, currentView]);
  
  const tauxEndettement = useMemo(() => {
    if (currentView === "monthly") {
      return totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
    } else {
      const revenuAnnuel = totalRevenue * 12;
      return revenuAnnuel > 0 ? (totalAmount / revenuAnnuel) * 100 : 0;
    }
  }, [totalAmount, totalRevenue, currentView]);
  
  const getBadgeVariant = (taux: number) => {
    if (taux < 30) return "default";
    if (taux < 40) return "secondary";
    return "destructive";
  };
  
  const getStatusIcon = (taux: number) => {
    if (taux < 30) return <CheckCircle className="h-3.5 w-3.5 text-white" />;
    if (taux < 40) return <Info className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />;
    return <AlertCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />;
  };
  
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
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
          "bg-gradient-to-br from-background/90 to-purple-50/90 shadow-md hover:shadow-lg border-purple-100/50",
          "dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-purple-950/90 dark:border-purple-800/20 dark:shadow-purple-900/20"
        )}
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                "bg-purple-100 text-purple-600",
                "dark:bg-purple-900/50 dark:text-purple-300"
              )}>
                <CreditCardIcon className="h-4 w-4" />
              </div>
              <span className="text-gray-800 dark:text-white">Crédits</span>
            </CardTitle>
            <Badge 
              variant={getBadgeVariant(tauxEndettement)} 
              className={cn(
                "bg-purple-500 px-2 py-0.5 flex items-center gap-1",
                "dark:bg-opacity-90 dark:font-medium"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer">
                    {getStatusIcon(tauxEndettement)}
                    <span className="text-xs">{Math.round(tauxEndettement)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700">
                  <p className="flex items-center gap-1 dark:text-white">
                    <Info className="h-4 w-4" />
                    Taux d'endettement {currentView === "monthly" ? "mensuel" : "annuel"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <motion.p 
              className={cn(
                "font-bold text-2xl",
                "text-gray-800",
                "dark:text-purple-50"
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            >
              {Math.round(totalAmount).toLocaleString('fr-FR')} €
            </motion.p>
            
            <div className="absolute -inset-1 bg-purple-500/10 blur-md rounded-full opacity-0 dark:opacity-40" />
            
            <p className={cn(
              "text-xs mt-1",
              "text-gray-500",
              "dark:text-gray-400"
            )}>
              {currentView === "monthly" 
                ? `Total dû en ${currentMonthName}` 
                : `Total dû en ${currentYear}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};