
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveVehiclesGrid } from "./ActiveVehiclesGrid";
import { SoldVehiclesList } from "./SoldVehiclesList";
import { useVehicles } from "@/hooks/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { useVehiclesContainer } from "@/hooks/useVehiclesContainer";

interface VehiclesTabsProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export const VehiclesTabs = ({ vehicles, isLoading }: VehiclesTabsProps) => {
  const [activeTab, setActiveTab] = useState("active");
  const { selectedVehicleId, setSelectedVehicleId } = useVehiclesContainer();
  const { deleteVehicle, updateVehicle, isDeleting, isMarking } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };
  
  const handleVehicleClick = (id: string) => {
    setSelectedVehicleId(id);
    // Naviguer vers la page de détail
    window.location.href = `/vehicles/${id}`;
  };
  
  // Compte des véhicules actifs et vendus pour les badges
  const activeVehiclesCount = vehicles?.filter(v => v.status !== "vendu").length || 0;
  const soldVehiclesCount = vehicles?.filter(v => v.status === "vendu").length || 0;

  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Tabs 
      defaultValue="active" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="bg-gradient-to-b from-gray-100/80 to-transparent dark:from-gray-900/30 dark:to-transparent rounded-xl p-4 mb-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger 
            value="active" 
            className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            Véhicules actifs
            {activeVehiclesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 rounded-full text-xs px-2 py-0.5">
                {activeVehiclesCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="sold"
            className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            Véhicules vendus
            {soldVehiclesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 rounded-full text-xs px-2 py-0.5">
                {soldVehiclesCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="active" className={cn("space-y-4 mt-2", activeTab !== "active" && "hidden")}>
        <motion.div
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ActiveVehiclesGrid 
            vehicles={vehicles || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onVehicleClick={handleVehicleClick}
            isDeleting={isDeleting || isMarking}
          />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="sold" className={cn("space-y-4 mt-2", activeTab !== "sold" && "hidden")}>
        <motion.div
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <SoldVehiclesList 
            vehicles={vehicles || []} 
            onVehicleClick={handleVehicleClick} 
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};
