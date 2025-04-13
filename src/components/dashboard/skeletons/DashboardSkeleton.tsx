
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";

/**
 * Skeleton de chargement pour le tableau de bord
 * Affiche une représentation visuelle du contenu pendant le chargement des données
 */
export const DashboardSkeleton = () => {
  const isMobile = useIsMobile();
  
  // Animation pour l'apparition progressive des éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
  };

  return (
    <motion.div
      className="space-y-8 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* En-tête du tableau de bord */}
      <motion.div variants={itemVariants} className="space-y-2">
        <Skeleton className="h-8 w-3/4 max-w-[300px]" />
        <Skeleton className="h-4 w-1/2 max-w-[200px]" />
      </motion.div>

      {/* Section des cartes principales */}
      <motion.div variants={itemVariants}>
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[100px] rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Section des statistiques de dépenses */}
      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-8 w-[100px] rounded-md" />
            </div>
            <div className={cn(
              "grid gap-4 pt-2", 
              isMobile ? "grid-cols-2" : "grid-cols-4"
            )}>
              {[...Array(isMobile ? 2 : 4)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-8 w-[140px]" />
                </div>
              ))}
            </div>
            <Skeleton className="h-[200px] w-full mt-4" />
          </div>
        </Card>
      </motion.div>

      {/* Section des graphiques - uniquement sur desktop */}
      {!isMobile && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <Card key={idx} className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[180px]" />
                </div>
                <Skeleton className="h-[200px] w-full rounded-md" />
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section des contributeurs */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-[200px]" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 border rounded-md">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
                <Skeleton className="h-6 w-[80px]" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
