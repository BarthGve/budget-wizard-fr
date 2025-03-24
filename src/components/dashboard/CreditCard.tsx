
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCreditCardData } from "./credit-card/useCreditCardData";
import { CreditCardHeader } from "./credit-card/CreditCardHeader";
import { CreditCardAmount } from "./credit-card/CreditCardAmount";

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
  
  // Utiliser le hook personnalisé pour obtenir les données
  const { 
    totalAmount,
    tauxEndettement,
    badgeVariant,
    currentMonthName,
    currentYear
  } = useCreditCardData({
    totalMensualites,
    totalRevenue,
    currentView
  });
  
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
          // Light mode styles
          "bg-gradient-to-br from-white to-purple-50 shadow-lg border border-purple-100 hover:shadow-xl",
          // Dark mode styles - alignées avec les cards de graphiques
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-purple-950 dark:border-purple-900/30 dark:shadow-purple-800/30 dark:hover:shadow-purple-800/50"
        )}
        onClick={() => navigate("/credits")}
      >
        <CreditCardHeader 
          tauxEndettement={tauxEndettement}
          badgeVariant={badgeVariant}
          currentView={currentView}
          currentMonthName={currentMonthName}
          currentYear={currentYear}
        />
        <CreditCardAmount totalAmount={totalAmount} />
      </Card>
    </motion.div>
  );
};
