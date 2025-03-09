
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { memo } from "react";
import { LayoutDashboard } from "lucide-react"; // Ajout d'une icône de tableau de bord

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-4 mb-2 border-b border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-lg shadow-sm mt-0.5"
          >
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          </motion.div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentView === "monthly" 
                ? `Aperçu du budget pour ${currentMonthName} ${new Date().getFullYear()}` 
                : `Aperçu du budget annuel ${new Date().getFullYear()}`}
            </p>
          </div>
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
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 shadow-inner">
              <motion.div
                initial="inactive"
                animate={currentView === "monthly" ? "active" : "inactive"}
                whileHover="hover"
                variants={tabVariants}
              >
                <TabsTrigger value="monthly" className="font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md">
                  Mensuel
                </TabsTrigger>
              </motion.div>
              <motion.div
                initial="inactive"
                animate={currentView === "yearly" ? "active" : "inactive"}
                whileHover="hover"
                variants={tabVariants}
              >
                <TabsTrigger value="yearly" className="font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md">
                  Annuel
                </TabsTrigger>
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
