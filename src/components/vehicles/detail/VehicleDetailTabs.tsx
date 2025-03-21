
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types/vehicle";
import { VehicleGeneralInfo } from "./VehicleGeneralInfo";
import { VehiclePhotoCard } from "./photo-card";
import { VehicleExpenseContainer } from "@/components/vehicles/expenses/VehicleExpenseContainer";
import { VehicleExpenseStats } from "@/components/vehicles/expenses/VehicleExpenseStats";
import { motion } from "framer-motion";
import { VehicleMonthlyExpensesChart } from "./expenses-chart/VehicleMonthlyExpensesChart";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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
            <>
              <motion.div variants={itemVariants}>
                <VehicleMonthlyExpensesChart vehicleId={vehicle.id} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <VehicleExpenseStats vehicleId={vehicle.id} />
              </motion.div>
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
    </Tabs>
  );
};
