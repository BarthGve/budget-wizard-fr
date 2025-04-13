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
  
  // Récupérer les crédits pour calculer le montant annuel précis
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Calculer le montant total des mensualités en fonction de la vue
  const totalAmount = useMemo(() => {
    if (currentView === "monthly") {
      return totalMensualites;
    } else {
      // Pour la vue annuelle, calculer le montant en tenant compte des crédits qui se terminent pendant l'année
      const currentYear = new Date().getFullYear();
      const lastDayOfYear = new Date(currentYear, 11, 31); // 31 décembre de l'année en cours
      const today = new Date();
      
      return credits.reduce((total, credit) => {
        const derniereMensualite = new Date(credit.date_derniere_mensualite);
        
        // Si le crédit se termine cette année
        if (derniereMensualite.getFullYear() === currentYear) {
          // Calculer combien de mois restants dans l'année pour ce crédit
          // Nombre de mois entre aujourd'hui et dernière mensualité (inclus le mois courant)
          const moisRestants = (derniereMensualite.getMonth() - today.getMonth()) + 1;
          // Ajouter le montant des mensualités restantes
          return total + (credit.montant_mensualite * Math.max(0, moisRestants));
        } else if (derniereMensualite > lastDayOfYear) {
          // Si le crédit continue après cette année, ajouter le montant pour tous les mois restants de l'année
          const moisRestants = 12 - today.getMonth();
          return total + (credit.montant_mensualite * moisRestants);
        }
        
        return total;
      }, 0);
    }
  }, [totalMensualites, credits, currentView]);
  
  // Calculer le taux d'endettement en fonction de la vue (mensuel ou annuel)
  const tauxEndettement = useMemo(() => {
    if (currentView === "monthly") {
      return totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
    } else {
      // Pour la vue annuelle, calculer le taux sur la base du revenu annuel
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
    if (taux < 30) return <CheckCircle className="h-4 w-4 text-white" />;
    if (taux < 40) return <Info className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
    return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
  };
  
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
     <Card
  className={cn(
    "backdrop-blur-sm cursor-pointer transition-all duration-300",
   "shadow-lg border hover:shadow-xl",
    "dark:bg-primary/10 dark:border-primary/30 dark:shadow-primary/30 dark:hover:shadow-primary/50"
  )}
  onClick={() => navigate("/credits")}
>
  <CardHeader className="py-4">
    <div className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg flex items-center gap-2">
        <div className={cn(
          "p-2 rounded-full",
          "bg-primary/20 text-primary",
          "dark:bg-primary/20 dark:text-primary"
        )}>
          <CreditCardIcon className="h-5 w-5" />
        </div>
        <span >Crédits</span>
      </CardTitle>
      <Badge 
        variant="default"
        className={cn(
          "bg-primary px-3 py-1 flex items-center gap-1 text-white",
          "dark:bg-primary dark:text-white"
        )}
      >
        {getStatusIcon(tauxEndettement)}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <span className="text-xs">{Math.round(tauxEndettement)}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="dark:bg-primary dark:text-white dark:border-primary">
            <p className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Taux d'endettement {currentView === "monthly" ? "mensuel" : "annuel"}
            </p>
          </TooltipContent>
        </Tooltip>
      </Badge>
    </div>
    <CardDescription className= "text-gray-500 dark:text-gray-400">
      {currentView === "monthly" 
        ? `Total dû en ${currentMonthName}` 
        : `Total dû en ${currentYear}`}
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
           
                  "font-bold text-xl leading-none",
                  "text-gray-800", // Light mode
                  "dark:text-primary" // Dark mode - couleur quinary pour correspondre à l'effet voulu            
             
            )}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {Math.round(totalAmount).toLocaleString('fr-FR')} €
          </motion.p>
          <div className="absolute -inset-1 bg-primary/10 blur-md rounded-full opacity-0 dark:opacity-60" />
        </motion.div>
      </div>
    </div>
  </CardContent>
</Card>
    </motion.div>
  );
};