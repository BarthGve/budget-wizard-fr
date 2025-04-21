import { Property } from "@/types/property";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AddExpenseDialog } from "@/components/properties/AddExpenseDialog";
import { PropertyWeather } from "@/components/properties/PropertyWeather";

interface PropertyHeaderProps {
  property: Property;
  refetchExpenses: () => void;
  expenseToEdit: any;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
}

export const PropertyHeader = ({ 
  property, 
  refetchExpenses, 
  expenseToEdit,
  isEditDialogOpen,
  setIsEditDialogOpen
}: PropertyHeaderProps) => {
  return (
    <motion.div 
      className="flex flex-col gap-4 md:gap-6 w-full px-2 md:px-0 py-1
        bg-white/85 dark:bg-quaternary-900/30 backdrop-blur-md rounded-2xl shadow-md border border-white/25 dark:border-quaternary-800/30"
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        visible: { 
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.42
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/properties" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
          <ChevronLeft className="h-4 w-4" />
          <span>Retour aux biens</span>
        </Link>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 w-full">
        <div className="flex-1 min-w-0">
          <h1 className="font-bold tracking-tight text-3xl md:text-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in mb-1">
            {property.name}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base truncate">{property.address}</p>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {property.latitude && property.longitude && 
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PropertyWeather latitude={property.latitude} longitude={property.longitude} />
            </motion.div>
          }
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <AddExpenseDialog 
              propertyId={property.id} 
              onExpenseAdded={() => refetchExpenses()} 
              expense={expenseToEdit} 
              open={isEditDialogOpen} 
              onOpenChange={setIsEditDialogOpen} 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
