
import { AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFloatingActionButton } from "./useFloatingActionButton";
import { MenuButton } from "./MenuButton";
import { ActionMenu } from "./ActionMenu";
import { VehiclesList } from "./VehiclesList";
import { RetailersList } from "./RetailersList";
import { ExpenseDialogs } from "./ExpenseDialogs";
import { useLocation } from "react-router-dom";

/**
 * Bouton d'action flottant avec design inspiré d'Apple
 * Utilise un effet de glassmorphism et des animations fluides
 */
export const FloatingActionButton = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  
  // Vérifier si nous sommes sur une page de détail de véhicule
  const isVehicleDetailPage = location.pathname.includes('/vehicles/') && 
                             !location.pathname.endsWith('/vehicles');
  
  const {
    // États
    isMenuOpen,
    showVehiclesList,
    showRetailersList,
    expenseDialogOpen,
    retailerExpenseDialogOpen,
    selectedVehicle,
    selectedRetailer,
    retailers,
    isLoadingRetailers,
    activeVehicles,
    isLoading,
    isProUser,
    
    // Gestionnaires d'événements
    toggleMenu,
    handleAddFuelExpenseClick,
    handleAddRetailerExpense,
    handleVehicleSelect,
    handleRetailerSelect,
    handleExpenseSuccess,
    handleExpenseCancel,
    handleRetailerExpenseSuccess,
    handleRetailerExpenseCancel,
    
    // Setters
    setExpenseDialogOpen,
    setRetailerExpenseDialogOpen,
    setShowVehiclesList
  } = useFloatingActionButton();

  // Ne pas afficher sur desktop ou sur les pages de détail de véhicule
  if (!isMobile || isVehicleDetailPage) return null;

  return (
    <>
      <div className="fixed right-5 bottom-8 z-50 flex flex-col-reverse items-end space-y-reverse space-y-3">
        <AnimatePresence>
          {isMenuOpen && !showVehiclesList && !showRetailersList && (
            <ActionMenu
              isProUser={isProUser}
              handleAddFuelExpenseClick={handleAddFuelExpenseClick}
              handleAddRetailerExpense={handleAddRetailerExpense}
            />
          )}

          {isMenuOpen && showVehiclesList && (
            <VehiclesList
              vehicles={activeVehicles}
              isLoading={isLoading}
              onVehicleSelect={handleVehicleSelect}
              onBackClick={() => setShowVehiclesList(false)}
            />
          )}

          {isMenuOpen && showRetailersList && (
            <RetailersList
              retailers={retailers}
              isLoading={isLoadingRetailers}
              onRetailerSelect={handleRetailerSelect}
              onBackClick={() => setShowVehiclesList(false)}
            />
          )}
        </AnimatePresence>
        
        <MenuButton 
          isOpen={isMenuOpen} 
          onClick={toggleMenu} 
        />
      </div>

      <ExpenseDialogs
        selectedVehicle={selectedVehicle}
        selectedRetailer={selectedRetailer}
        expenseDialogOpen={expenseDialogOpen}
        retailerExpenseDialogOpen={retailerExpenseDialogOpen}
        setExpenseDialogOpen={setExpenseDialogOpen}
        setRetailerExpenseDialogOpen={setRetailerExpenseDialogOpen}
        handleExpenseSuccess={handleExpenseSuccess}
        handleExpenseCancel={handleExpenseCancel}
        handleRetailerExpenseSuccess={handleRetailerExpenseSuccess}
      />
    </>
  );
};
