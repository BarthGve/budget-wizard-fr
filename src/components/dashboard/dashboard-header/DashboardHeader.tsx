
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { memo } from "react";

interface DashboardHeaderProps {
  currentView: "monthly" | "yearly";
  setCurrentView: (view: "monthly" | "yearly") => void;
  currentMonthName: string;
}

// Animation variants pour les onglets
const tabVariants = {
  inactive: { 
    scale: 0.95,
    opacity: 0.7,
    y: 0 
  },
  active: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  hover: { 
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Composant d'en-tête optimisé avec mémoisation
export const DashboardHeader = memo(({ 
  currentView, 
  setCurrentView, 
  currentMonthName 
}: DashboardHeaderProps) => {
  // Fonction de changement de vue
  const handleViewChange = (value: string) => {
    setCurrentView(value as "monthly" | "yearly");
  };

  return (
    <motion.div className="space-y-2" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            {currentView === "monthly" 
              ? `Aperçu du budget pour le mois de ${currentMonthName} ${new Date().getFullYear()}` 
              : `Aperçu du budget annuel ${new Date().getFullYear()}`}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Tabs
            defaultValue={currentView}
            onValueChange={handleViewChange}
            className="w-[250px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <motion.div
                initial="inactive"
                animate={currentView === "monthly" ? "active" : "inactive"}
                whileHover="hover"
                variants={tabVariants}
              >
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
              </motion.div>
              <motion.div
                initial="inactive"
                animate={currentView === "yearly" ? "active" : "inactive"}
                whileHover="hover"
                variants={tabVariants}
              >
                <TabsTrigger value="yearly">Annuel</TabsTrigger>
              </motion.div>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
});

// Affichage explicite du nom du composant pour le débogage
DashboardHeader.displayName = "DashboardHeader";
