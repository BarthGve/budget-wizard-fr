
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyChartProps {
  className?: string;
}

/**
 * Composant pour afficher un état vide lorsqu'il n'y a pas de données
 */
export function EmptyChart({ className }: EmptyChartProps) {
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
      className={cn("flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2", className)}
      variants={itemVariants}
    >
      <BarChart3 className="h-12 w-12 text-blue-200 dark:text-blue-800/40" />
      <p className="text-center text-blue-600/70 dark:text-blue-400/70">
        Aucune donnée disponible pour afficher l'évolution des dépenses
      </p>
    </motion.div>
  );
}
