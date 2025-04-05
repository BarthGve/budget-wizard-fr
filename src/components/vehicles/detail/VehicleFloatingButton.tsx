
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, FileUp, CreditCard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AddVehicleExpenseDialog } from "@/components/vehicles/expenses/AddVehicleExpenseDialog";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";

interface VehicleFloatingButtonProps {
  vehicleId: string;
}

export const VehicleFloatingButton = ({ vehicleId }: VehicleFloatingButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isDocumentSheetOpen, setIsDocumentSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const { vehicle } = useVehicleDetail(vehicleId);
  
  // Ne pas afficher pour les véhicules vendus
  if (vehicle?.status === 'vendu' || !isMobile) {
    return null;
  }
  
  // Animation variants pour les boutons
  const buttonVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.8 },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };
  
  // Animation variants pour le menu
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const handleAddExpense = () => {
    setIsExpenseDialogOpen(true);
    setIsOpen(false);
  };
  
  const handleAddDocument = () => {
    setIsDocumentSheetOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed right-5 bottom-20 z-50 flex flex-col-reverse items-end space-y-reverse space-y-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col items-end space-y-3 mb-3"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={buttonVariants}>
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-white/20 dark:border-gray-700/30">
                    Ajouter une dépense
                  </span>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAddExpense}
                      className="h-12 w-12 rounded-full backdrop-blur-md bg-green-500/90 hover:bg-green-500 shadow-lg border border-green-400/20"
                    >
                      <CreditCard className="h-5 w-5 text-white" />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div variants={buttonVariants}>
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-white/20 dark:border-gray-700/30">
                    Ajouter un document
                  </span>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAddDocument}
                      className="h-12 w-12 rounded-full backdrop-blur-md bg-blue-500/90 hover:bg-blue-500 shadow-lg border border-blue-400/20"
                    >
                      <FileUp className="h-5 w-5 text-white" />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-14 w-14 rounded-full backdrop-blur-md shadow-lg",
              "bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-gray-700/30",
              "hover:bg-white/90 dark:hover:bg-slate-800/90",
              "transition-all duration-300 ease-in-out",
            )}
            style={{ 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)"
            }}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Car className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Dialogue de dépense */}
      <AddVehicleExpenseDialog
        vehicleId={vehicleId}
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        onSuccess={() => setIsExpenseDialogOpen(false)}
        onCancel={() => setIsExpenseDialogOpen(false)}
        colorScheme="gray"
        initialValues={{
          vehicleId: vehicleId,
          expenseType: "carburant",
          date: new Date().toISOString().split('T')[0],
          amount: "",
          mileage: "",
          fuelVolume: "",
          maintenanceType: "",
          repairType: "",
          comment: ""
        }}
      />
      
      {/* Feuille pour ajouter un document */}
      <Sheet open={isDocumentSheetOpen} onOpenChange={setIsDocumentSheetOpen}>
        <SheetContent side="bottom" className="h-[90%] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Ajouter un document</SheetTitle>
          </SheetHeader>
          <div className="mt-4 p-4 overflow-y-auto h-full">
            <iframe 
              src={`/vehicles/${vehicleId}?tab=documents&mode=add`} 
              className="w-full h-full border-none"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
