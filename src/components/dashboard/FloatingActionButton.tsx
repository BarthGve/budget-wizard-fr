
import { Plus, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVehiclesContainer } from "@/hooks/useVehiclesContainer";
import { useVehicles } from "@/hooks/useVehicles";

/**
 * Bouton d'action flottant qui s'affiche sur mobile pour ajouter des dépenses rapidement
 */
export const FloatingActionButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVehiclesList, setShowVehiclesList] = useState(false);
  const navigate = useNavigate();
  const { selectedVehicleId, setSelectedVehicleId } = useVehiclesContainer();
  const { vehicles, isLoading } = useVehicles();
  
  // Liste des véhicules actifs uniquement
  const activeVehicles = vehicles?.filter(v => v.status !== "vendu") || [];

  // Méthodes pour gérer les différentes actions
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (showVehiclesList && !isMenuOpen) {
      setShowVehiclesList(false);
    }
  };
  
  const handleAddFuelExpenseClick = () => {
    // Afficher la liste des véhicules si on a des véhicules actifs
    if (activeVehicles.length > 0) {
      setShowVehiclesList(true);
    } else {
      // Si aucun véhicule n'est disponible, naviguer vers la page des véhicules
      navigate('/vehicles?action=addVehicle');
      setIsMenuOpen(false);
    }
  };
  
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    navigate(`/vehicles/${vehicleId}?openExpenseDialog=true&type=fuel`);
    setIsMenuOpen(false);
    setShowVehiclesList(false);
  };
  
  const handleAddRetailerExpense = () => {
    navigate('/expenses?action=addExpense');
    setIsMenuOpen(false);
  };

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
      transition: { 
        duration: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    }
  };

  // Fermer le menu lorsqu'on change de page
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
      setShowVehiclesList(false);
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col-reverse items-end space-y-reverse space-y-2">
      {/* Menu flottant qui s'affiche lors du clic sur le bouton principal */}
      <AnimatePresence>
        {isMenuOpen && !showVehiclesList && (
          <motion.div 
            className="flex flex-col items-end gap-2"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Option pour ajouter une dépense carburant */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-lg shadow-md">
                Dépense carburant
              </span>
              <Button 
                size="sm" 
                className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                onClick={handleAddFuelExpenseClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 22h12a2 2 0 0 0 2-2V7.5L14.5 4H4a1 1 0 0 0-1 1v15a2 2 0 0 0 2 2Z" />
                  <path d="M14 4v3.5H21L14 4Z" />
                  <path d="M9 14h2" />
                  <path d="M14 9v6" />
                  <path d="M9 19h6" />
                </svg>
              </Button>
            </motion.div>
            
            {/* Option pour ajouter une dépense enseigne */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-lg shadow-md">
                Dépense enseigne
              </span>
              <Button 
                size="sm" 
                className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg"
                onClick={handleAddRetailerExpense}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Liste des véhicules qui s'affiche lorsqu'on clique sur dépense carburant */}
        {isMenuOpen && showVehiclesList && (
          <motion.div 
            className="flex flex-col items-end gap-2 min-w-52"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setShowVehiclesList(false)}
              >
                Retour
              </Button>
              <span className="text-sm font-medium">Sélectionner un véhicule</span>
            </motion.div>
            
            {isLoading ? (
              <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                Chargement...
              </motion.div>
            ) : activeVehicles.length === 0 ? (
              <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                Aucun véhicule disponible
              </motion.div>
            ) : (
              activeVehicles.map(vehicle => (
                <motion.div 
                  key={vehicle.id}
                  variants={itemVariants}
                  className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleVehicleSelect(vehicle.id)}
                >
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{vehicle.brand} {vehicle.model || ""}</span>
                  </div>
                  <span className="text-xs text-gray-500">{vehicle.registration_number}</span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bouton principal qui ouvre le menu */}
      <Button 
        onClick={toggleMenu}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl",
          "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90",
          "transition-all duration-300 ease-in-out transform",
          isMenuOpen && "rotate-45"
        )}
      >
        <Plus className="h-7 w-7" />
      </Button>
    </div>
  );
};
