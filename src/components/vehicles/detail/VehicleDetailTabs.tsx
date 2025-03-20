
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types/vehicle";
import { VehicleGeneralInfo } from "./VehicleGeneralInfo";
import { VehiclePhotoCard } from "./photo-card";
import { VehicleExpenseContainer } from "@/components/vehicles/expenses/VehicleExpenseContainer";
import { VehicleExpenseStats } from "@/components/vehicles/expenses/VehicleExpenseStats";
import { motion } from "framer-motion";

interface VehicleDetailTabsProps {
  vehicle: Vehicle;
  canAccessExpenses: boolean;
}

export const VehicleDetailTabs = ({
  vehicle,
  canAccessExpenses
}: VehicleDetailTabsProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Tabs defaultValue="details" className="space-y-6">
      <TabsList>
        <TabsTrigger value="details">Détails</TabsTrigger>
        {canAccessExpenses && <TabsTrigger value="expenses">Dépenses</TabsTrigger>}
      </TabsList>

      <TabsContent value="details">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="grid md:grid-cols-2 gap-6" variants={itemVariants}>
            <VehicleGeneralInfo vehicle={vehicle} />
            <VehiclePhotoCard vehicle={vehicle} />
          </motion.div>
          
          {canAccessExpenses && (
            <motion.div variants={itemVariants}>
              <VehicleExpenseStats vehicleId={vehicle.id} />
            </motion.div>
          )}
        </motion.div>
      </TabsContent>

      {canAccessExpenses && (
        <TabsContent value="expenses">
          <motion.div variants={itemVariants}>
            <VehicleExpenseContainer vehicleId={vehicle.id} />
          </motion.div>
        </TabsContent>
      )}
    </Tabs>
  );
};
