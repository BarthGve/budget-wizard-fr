
import { motion } from "framer-motion";
import { ExpensesHeaderSkeleton } from "./ExpensesHeaderSkeleton";
import { RetailerBannerSkeleton } from "./RetailerBannerSkeleton";
import { YearlyTotalCardSkeleton } from "./YearlyTotalCardSkeleton";
import { AverageExpensesCardSkeleton } from "./AverageExpensesCardSkeleton";
import { RetailersChartSkeleton } from "./RetailersChartSkeleton";
import { RetailerCardSkeleton } from "./RetailerCardSkeleton";
import { MiniRetailerCardSkeleton } from "./MiniRetailerCardSkeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ExpensesPageSkeletonProps {
  displayMode?: 'grid' | 'list';
}

export function ExpensesPageSkeleton({ displayMode = 'grid' }: ExpensesPageSkeletonProps) {
  // Utiliser useMediaQuery pour détecter les petits écrans (smartphones)
  const isMobileScreen = useMediaQuery("(max-width: 768px)");
  
  // Animation variants pour le container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  // Animation variants pour les éléments
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="grid gap-6 container px-4 py-6 mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="space-y-4 gap-6">
        <ExpensesHeaderSkeleton />
        <RetailerBannerSkeleton />
        
        {/* Disposition avec flex pour les écrans larges, colonne pour mobile */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 mt-8 mb-8">
          {/* Cartes de statistiques (1/3 sur grands écrans, pleine largeur sur mobile) */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/3 grid grid-cols-1 gap-4">
            <YearlyTotalCardSkeleton />
            <AverageExpensesCardSkeleton />
          </motion.div>
          
          {/* Graphique des dépenses par enseigne (2/3) - masqué sur mobile */}
          {!isMobileScreen && (
            <motion.div variants={itemVariants} className="w-full lg:w-2/3">
              <RetailersChartSkeleton />
            </motion.div>
          )}
        </motion.div>
        
        {/* Grid des cartes de détaillants */}
        <div className={`py-8 grid grid-cols-1 ${displayMode === 'grid' 
          ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
          : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"}`}
        >
          {[...Array(8)].map((_, i) => (
            displayMode === 'grid' 
              ? <RetailerCardSkeleton key={i} /> 
              : <MiniRetailerCardSkeleton key={i} delay={i} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
