
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export function ChartEmptyState() {
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2"
      variants={itemVariants}
    >
      <BarChart3 className="h-12 w-12 text-blue-200 dark:text-blue-800/40" />
      <p className="text-center text-blue-600/70 dark:text-blue-400/70">
        Aucune donnée disponible pour afficher l'évolution des dépenses
      </p>
    </motion.div>
  );
}
