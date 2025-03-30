import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Car, 
  FileUp, 
  CreditCard,
  ChevronUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
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
        staggerChildren: 0.1,
        delayChildren: 0.1
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
      <div className="fixed right-4 bottom-20 z-50 flex flex-col-reverse items-end space-y-reverse space-y-2">
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
                <div className="flex items-center gap-2">
                  <span className="bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-lg shadow-md">
                    Ajouter une dépense
                  </span>
                  <Button
                    onClick={handleAddExpense}
                    className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                  >
                    <CreditCard className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
              
              <motion.div variants={buttonVariants}>
                <div className="flex items-center gap-2">
                  <span className="bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-lg shadow-md">
                    Ajouter un document
                  </span>
                  <Button
                    onClick={handleAddDocument}
                    className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                  >
                    <FileUp className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-xl",
            "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90",
            "transition-all duration-300 ease-in-out transform",
          )}
        >
          {isOpen ? <X className="h-7 w-7" /> : <Car className="h-7 w-7" />}
        </Button>
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
