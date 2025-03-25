
import { Plus, Car, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVehiclesContainer } from "@/hooks/useVehiclesContainer";
import { useVehicles } from "@/hooks/useVehicles";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddVehicleExpenseDialog } from "@/components/vehicles/expenses/AddVehicleExpenseDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type pour les détaillants (enseignes)
interface Retailer {
  id: string;
  name: string;
  logo_url?: string;
}

/**
 * Bouton d'action flottant qui s'affiche sur mobile pour ajouter des dépenses rapidement
 */
export const FloatingActionButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVehiclesList, setShowVehiclesList] = useState(false);
  const [showRetailersList, setShowRetailersList] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [retailerExpenseDialogOpen, setRetailerExpenseDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isLoadingRetailers, setIsLoadingRetailers] = useState(false);
  const navigate = useNavigate();
  const { selectedVehicleId, setSelectedVehicleId } = useVehiclesContainer();
  const { vehicles, isLoading } = useVehicles();
  
  // Liste des véhicules actifs uniquement
  const activeVehicles = vehicles?.filter(v => v.status !== "vendu") || [];

  // Charger les détaillants (enseignes)
  useEffect(() => {
    const fetchRetailers = async () => {
      setIsLoadingRetailers(true);
      try {
        const { data, error } = await supabase
          .from("retailers")
          .select("*")
          .order("name");

        if (error) throw error;
        setRetailers(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des enseignes:", error);
        toast.error("Impossible de charger les enseignes");
      } finally {
        setIsLoadingRetailers(false);
      }
    };

    if (showRetailersList) {
      fetchRetailers();
    }
  }, [showRetailersList]);

  // Méthodes pour gérer les différentes actions
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if ((showVehiclesList || showRetailersList) && !isMenuOpen) {
      setShowVehiclesList(false);
      setShowRetailersList(false);
    }
  };
  
  const handleAddFuelExpenseClick = () => {
    // Afficher la liste des véhicules si on a des véhicules actifs
    if (activeVehicles.length > 0) {
      setShowVehiclesList(true);
      setShowRetailersList(false);
    } else {
      // Si aucun véhicule n'est disponible, naviguer vers la page des véhicules
      navigate('/vehicles?action=addVehicle');
      setIsMenuOpen(false);
    }
  };
  
  const handleAddRetailerExpense = () => {
    // Afficher la liste des enseignes
    setShowRetailersList(true);
    setShowVehiclesList(false);
  };
  
  const handleVehicleSelect = (vehicleId: string) => {
    // Au lieu de naviguer, on stocke l'ID du véhicule sélectionné et on ouvre la modale
    setSelectedVehicleId(vehicleId);
    setSelectedVehicle(vehicleId);
    setExpenseDialogOpen(true);
    setIsMenuOpen(false);
    setShowVehiclesList(false);
  };
  
  const handleRetailerSelect = (retailer: Retailer) => {
    // Stocke l'enseigne sélectionnée et ouvre la modale
    setSelectedRetailer(retailer);
    setRetailerExpenseDialogOpen(true);
    setIsMenuOpen(false);
    setShowRetailersList(false);
  };
  
  const handleExpenseSuccess = () => {
    // Fermer la modale après l'ajout d'une dépense
    setExpenseDialogOpen(false);
    setSelectedVehicle(null);
  };
  
  const handleExpenseCancel = () => {
    // Fermer la modale si l'utilisateur annule
    setExpenseDialogOpen(false);
    setSelectedVehicle(null);
  };

  const handleRetailerExpenseSuccess = () => {
    // Fermer la modale après l'ajout d'une dépense
    setRetailerExpenseDialogOpen(false);
    setSelectedRetailer(null);
  };
  
  const handleRetailerExpenseCancel = () => {
    // Fermer la modale si l'utilisateur annule
    setRetailerExpenseDialogOpen(false);
    setSelectedRetailer(null);
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
      setShowRetailersList(false);
      setExpenseDialogOpen(false);
      setRetailerExpenseDialogOpen(false);
      setSelectedVehicle(null);
      setSelectedRetailer(null);
    };
  }, []);

  return (
    <>
      <div className="fixed right-4 bottom-20 z-50 flex flex-col-reverse items-end space-y-reverse space-y-2">
        {/* Menu flottant qui s'affiche lors du clic sur le bouton principal */}
        <AnimatePresence>
          {isMenuOpen && !showVehiclesList && !showRetailersList && (
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
                  <Store className="h-5 w-5" />
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

          {/* Liste des enseignes qui s'affiche lorsqu'on clique sur dépense enseigne */}
          {isMenuOpen && showRetailersList && (
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
                  onClick={() => setShowRetailersList(false)}
                >
                  Retour
                </Button>
                <span className="text-sm font-medium">Sélectionner une enseigne</span>
              </motion.div>
              
              {isLoadingRetailers ? (
                <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                  Chargement...
                </motion.div>
              ) : retailers.length === 0 ? (
                <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                  Aucune enseigne disponible
                </motion.div>
              ) : (
                retailers.map(retailer => (
                  <motion.div 
                    key={retailer.id}
                    variants={itemVariants}
                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleRetailerSelect(retailer)}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{retailer.name}</span>
                    </div>
                    {retailer.logo_url && (
                      <img 
                        src={retailer.logo_url} 
                        alt={retailer.name} 
                        className="h-6 w-6 object-contain"
                      />
                    )}
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

      {/* Modale pour ajouter une dépense carburant */}
      {selectedVehicle && (
        <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une dépense carburant</DialogTitle>
            </DialogHeader>
            <AddVehicleExpenseDialog
              vehicleId={selectedVehicle}
              hideDialogWrapper={true}
              onSuccess={handleExpenseSuccess}
              onCancel={handleExpenseCancel}
              initialValues={{
                vehicleId: selectedVehicle,
                expenseType: "carburant", // Valeur préréglée sur "carburant"
                date: new Date().toISOString().split('T')[0],
                amount: "",
                mileage: "",
                fuelVolume: "",
                maintenanceType: "",
                repairType: "",
                comment: ""
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modale pour ajouter une dépense enseigne */}
      {selectedRetailer && (
        <Dialog open={retailerExpenseDialogOpen} onOpenChange={setRetailerExpenseDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une dépense pour {selectedRetailer.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <AddExpenseDialog 
                onExpenseAdded={handleRetailerExpenseSuccess}
                preSelectedRetailer={selectedRetailer}
                open={retailerExpenseDialogOpen}
                onOpenChange={setRetailerExpenseDialogOpen}
                hideDialogWrapper={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
