
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
    if (taux < 30) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (taux < 40) return <Info className="h-4 w-4 text-amber-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
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
        className="bg-gradient-to-br from-background to-purple-50 backdrop-blur-sm shadow-lg border border-purple-100 cursor-pointer"
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CreditCardIcon className="h-6 w-6 text-purple-500" />
              Crédits
            </CardTitle>
            <Badge 
              variant={getBadgeVariant(tauxEndettement)} 
              className="px-3 py-1 flex items-center gap-1"
            >
              {getStatusIcon(tauxEndettement)}
              <span>{getStatusText(tauxEndettement)}</span>
            </Badge>
          </div>
          <CardDescription>Total dû en {currentMonthName}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.p 
                className="text-xl font-bold leading-none text-gray-800"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                {Math.round(totalMensualites).toLocaleString('fr-FR')} €
              </motion.p>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className="flex items-center gap-2 bg-white p-2 rounded-full shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium">{Math.round(tauxEndettement)}%</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Taux d'endettement mensuel
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};