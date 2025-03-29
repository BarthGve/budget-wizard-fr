
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types/vehicle";
import { VehicleGeneralInfo } from "./VehicleGeneralInfo";
import { VehiclePhotoCard } from "./photo-card";
import { VehicleExpenseContainer } from "@/components/vehicles/expenses/VehicleExpenseContainer";
import { VehicleExpenseStats } from "@/components/vehicles/expenses/VehicleExpenseStats";
import { motion } from "framer-motion";
import { VehicleMonthlyExpensesChart } from "./expenses-chart/VehicleMonthlyExpensesChart";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarClock, FileIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { VehicleDocumentsTab } from "../documents/VehicleDocumentsTab";

interface VehicleDetailTabsProps {
  vehicle: Vehicle;
  canAccessExpenses: boolean;
}

export const VehicleDetailTabs = ({
  vehicle,
  canAccessExpenses
}: VehicleDetailTabsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Vérifier si le véhicule est vendu
  const isVehicleSold = vehicle.status === 'vendu';

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

  // Fonction pour générer manuellement les dépenses depuis les charges récurrentes
  const handleGenerateExpensesFromRecurring = async () => {
    try {
      setIsGenerating(true);
      
      // Appeler la fonction Supabase pour générer les dépenses
      const { data, error } = await supabase
        .rpc('generate_vehicle_expenses_from_recurring');
      
      if (error) throw error;
      
      // Succès
      toast({
        title: "Génération effectuée",
        description: "Les dépenses liées aux charges récurrentes ont été générées",
        variant: "default"
      });
      
      // Attendre un peu puis actualiser la page pour voir les nouvelles dépenses
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Erreur lors de la génération des dépenses:", error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la génération des dépenses",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Tabs defaultValue="details" className="space-y-6">
      <TabsList>
        <TabsTrigger value="details">Détails</TabsTrigger>
        {canAccessExpenses && <TabsTrigger value="expenses">Dépenses</TabsTrigger>}
        <TabsTrigger value="documents">
          <span className="flex items-center gap-1">
            <FileIcon className="w-4 h-4" />
            Documents
          </span>
        </TabsTrigger>
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
          
          {isVehicleSold && canAccessExpenses && (
            <motion.div variants={itemVariants}>
              <Alert variant="default" className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <AlertTitle className="text-gray-800 dark:text-gray-200">Véhicule vendu</AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-400">
                  Ce véhicule est marqué comme vendu. Les données sont disponibles en lecture seule et aucune nouvelle dépense ne peut être ajoutée.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {canAccessExpenses && (
            <>
              <motion.div variants={itemVariants}>
                <VehicleMonthlyExpensesChart vehicleId={vehicle.id} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <VehicleExpenseStats vehicleId={vehicle.id} />
              </motion.div>
              {!isVehicleSold && (
                <motion.div variants={itemVariants} className="flex justify-end">
                  <Button 
                    onClick={handleGenerateExpensesFromRecurring}
                    className="gap-2"
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <CalendarClock className="h-4 w-4" />
                    {isGenerating ? "Génération en cours..." : "Générer les dépenses des charges récurrentes"}
                  </Button>
                </motion.div>
              )}
            </>
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

      <TabsContent value="documents">
        <VehicleDocumentsTab vehicleId={vehicle.id} />
      </TabsContent>
    </Tabs>
  );
};
