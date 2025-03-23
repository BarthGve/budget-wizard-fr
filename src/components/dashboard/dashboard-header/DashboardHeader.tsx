
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { memo, useState, useEffect } from "react";
import { LayoutDashboard } from "lucide-react"; // Ajout d'une icône de tableau de bord
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

// Options de gradients violet pour le titre
const TITLE_GRADIENTS = {
  // Option 1: Violet profond vers violet électrique
  deepViolet: "from-purple-800 via-violet-600 to-purple-500",
  // Option 2: Violet royal vers rose aube
  royalViolet: "from-violet-700 via-purple-600 to-fuchsia-500",
  // Option 3: Violet cosmique
  cosmicViolet: "from-indigo-800 via-violet-600 to-purple-500"
};

// Composant d'en-tête optimisé avec mémoisation
export const DashboardHeader = memo(({ 
  currentView, 
  setCurrentView, 
  currentMonthName 
}: DashboardHeaderProps) => {
  // Détection du mode sombre
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Détection des écrans mobiles
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Observer les changements de mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateDarkModeStatus = () => setIsDarkMode(darkModeMediaQuery.matches);
    
    darkModeMediaQuery.addEventListener('change', updateDarkModeStatus);
    return () => darkModeMediaQuery.removeEventListener('change', updateDarkModeStatus);
  }, []);

  // Fonction de changement de vue
  const handleViewChange = (value: string) => {
    setCurrentView(value as "monthly" | "yearly");
  };

  // Choix du gradient à utiliser (vous pouvez changer l'option ici)
  const currentGradient = TITLE_GRADIENTS.cosmicViolet;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "pb-4 mb-2",
      )}
    >
      <div className={cn(
        "flex flex-col gap-4",
        isMobile ? "" : "items-center justify-between flex-row"
      )}>
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={cn(
              "p-2.5 rounded-lg shadow-sm mt-0.5",
              // Light mode
              "bg-gradient-to-br from-purple-100 to-indigo-50",
              // Dark mode
              "dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-indigo-900/30 dark:shadow-purple-900/10"
            )}
          >
            <LayoutDashboard className={cn(
              "h-6 w-6",
              "text-purple-600", // Light mode
              "dark:text-purple-400" // Dark mode
            )} />
          </motion.div>
          
          <div>
            <h1 className={cn(
              "text-3xl font-bold text-primary"
            )}>
              Tableau de bord
            </h1>
            <p className={cn(
              "text-sm mt-1",
              "text-gray-500", // Light mode
              "dark:text-gray-400" // Dark mode
            )}>
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
          className={isMobile ? "w-full" : ""}
        >
          <Tabs
            defaultValue={currentView}
            onValueChange={handleViewChange}
            className={isMobile ? "w-full" : "w-[250px]"}
          >
            <TabsList className={cn(
              "grid w-full grid-cols-2 shadow-inner",
              "bg-gray-100/80", // Light mode
              "dark:bg-gray-800/90 dark:border dark:border-gray-700" // Dark mode
            )}>
              <motion.div
                initial="inactive"
                animate={currentView === "monthly" ? "active" : "inactive"}
                whileHover="hover"
                variants={tabVariants}
              >
                <TabsTrigger 
                  value="monthly" 
                  className={cn(
                    "font-medium z-10", 
                    // Light mode - selected state
                    "data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md",
                    // Dark mode - selected state
                    "dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-purple-300 dark:data-[state=active]:shadow-purple-900/20 dark:data-[state=active]:border dark:data-[state=active]:border-purple-800/30",
                    // Dark mode - normal state
                    "dark:text-gray-300"
                  )}
                >
                  Mensuel
                </TabsTrigger>
              </motion.div>
              <motion.div
                initial="inactive"
                animate={currentView === "yearly" ? "active" : "inactive"}
                whileHover="hover"
                variants={tabVariants}
              >
                <TabsTrigger 
                  value="yearly" 
                  className={cn(
                    "font-medium z-10", 
                    // Light mode - selected state
                    "data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md",
                    // Dark mode - selected state
                    "dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-purple-300 dark:data-[state=active]:shadow-purple-900/20 dark:data-[state=active]:border dark:data-[state=active]:border-purple-800/30",
                    // Dark mode - normal state
                    "dark:text-gray-300"
                  )}
                >
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
