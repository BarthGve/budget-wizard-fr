import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types/vehicle";
import { VehicleGeneralInfo } from "./VehicleGeneralInfo";
import { VehiclePhotoCard } from "./photo-card";
import { VehicleExpenseContainer } from "@/components/vehicles/expenses/VehicleExpenseContainer";
import { VehicleExpenseStats } from "@/components/vehicles/expenses/VehicleExpenseStats";
import { motion } from "framer-motion";
import { VehicleMonthlyExpensesChart } from "./expenses-chart/VehicleMonthlyExpensesChart";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarClock, FileIcon, ClipboardList, Info, BarChart } from "lucide-react";
import { toast } from "@/hooks/useToastWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { VehicleDocumentsTab } from "../documents/VehicleDocumentsTab";
import { VehicleStatisticsTab } from "../statistics/VehicleStatisticsTab";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface VehicleDetailTabsProps {
  vehicle: Vehicle;
  canAccessExpenses: boolean;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const VehicleDetailTabs = ({
  vehicle,
  canAccessExpenses,
  activeSection: externalActiveTab,
  onSectionChange: externalOnSectionChange
}: VehicleDetailTabsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isMobile = useIsMobile();
  const [internalActiveTab, setInternalActiveTab] = useState("details");
  
  const activeTab = externalActiveTab || internalActiveTab;
  
  const handleTabChange = (value: string) => {
    if (externalOnSectionChange) {
      externalOnSectionChange(value);
    } else {
      setInternalActiveTab(value);
    }
  };
  
  const detailsRef = useRef<HTMLDivElement>(null);
  const expensesRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  
  const isVehicleSold = vehicle.status === 'vendu';

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

  const handleGenerateExpensesFromRecurring = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase
        .rpc('check_and_generate_vehicle_expenses');
      
      if (error) throw error;
      
      toast.info("Génération effectuée", {
        description: "Les dépenses périodiques (charges récurrentes et crédits) ont été générées"
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Erreur lors de la génération des dépenses:", error);
      toast.error("Un problème est survenu lors de la génération des dépenses");
    } finally {
      setIsGenerating(false);
    }
  };

  return isMobile ? (
    <div className="space-y-6 pb-16">
      <div ref={detailsRef} id="details" className={cn("p-3 pt-0", activeTab !== "details" && "hidden")}>
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="grid grid-cols-1 gap-6" variants={itemVariants}>
            <VehiclePhotoCard vehicle={vehicle} />
            <VehicleGeneralInfo vehicle={vehicle} />
          </motion.div>
          
          {isVehicleSold && canAccessExpenses && (
            <motion.div variants={itemVariants}>
              <Alert variant="default" className="bg-gray-100/80 dark:bg-gray-800/70 border-gray-300/60 dark:border-gray-700/60">
                <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <AlertTitle className="text-gray-800 dark:text-gray-200 font-medium">Véhicule vendu</AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-400">
                  Ce véhicule est marqué comme vendu. Les données sont disponibles en lecture seule et aucune nouvelle dépense ne peut être ajoutée.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {canAccessExpenses && !isVehicleSold && (
            <motion.div variants={itemVariants} className="flex justify-center">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button 
                    className={cn(
                      "w-full gap-2 font-medium",
                      "bg-gray-100 hover:bg-gray-200 text-gray-700",
                      "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300",
                      "border border-gray-300 dark:border-gray-600"
                    )}
                    size="sm"
                    variant="outline"
                  >
                    <CalendarClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    Générer les dépenses périodiques
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Générer les dépenses périodiques</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Cette action va générer toutes les dépenses associées aux charges récurrentes et aux crédits liés à ce véhicule. Voulez-vous continuer ?
                  </div>
                  <DrawerFooter>
                    <Button
                      onClick={handleGenerateExpensesFromRecurring}
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Génération en cours..." : "Confirmer"}
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </motion.div>
          )}
          
          {canAccessExpenses && (
            <motion.div variants={itemVariants}>
              <VehicleExpenseStats vehicleId={vehicle.id} />
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <div ref={expensesRef} id="expenses" className={cn("p-3 pt-0", activeTab !== "expenses" && "hidden")}>
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <VehicleExpenseContainer vehicleId={vehicle.id} />
        </motion.div>
      </div>
      
      <div ref={statisticsRef} id="statistics" className={cn("p-3 pt-0", activeTab !== "statistics" && "hidden")}>
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <VehicleStatisticsTab vehicleId={vehicle.id} />
        </motion.div>
      </div>
      
      <div ref={documentsRef} id="documents" className={cn("p-3 pt-0", activeTab !== "documents" && "hidden")}>
        <VehicleDocumentsTab vehicleId={vehicle.id} />
      </div>
    </div>
  ) : (
    <Card className={cn(
      "p-0 overflow-hidden border rounded-lg shadow-sm",
      "bg-white dark:bg-gray-900",
      "border-gray-200 dark:border-gray-800"
    )}>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className={cn(
          "w-full flex justify-start rounded-none border-b p-0 h-auto",
          "bg-gray-50 dark:bg-gray-900/50"
        )}>
          <TabsTrigger 
            value="details" 
            className={cn(
              "flex-1 max-w-[200px] rounded-none border-b-2 border-transparent py-3 px-4",
              "data-[state=active]:border-b-primary data-[state=active]:bg-white data-[state=active]:shadow-none",
              "dark:data-[state=active]:bg-gray-800 dark:text-gray-300",
              "flex items-center gap-1.5"
            )}
          >
            <Info className="w-4 h-4" />
            Détails
          </TabsTrigger>
          {canAccessExpenses && (
            <TabsTrigger 
              value="expenses"
              className={cn(
                "flex-1 max-w-[200px] rounded-none border-b-2 border-transparent py-3 px-4",
                "data-[state=active]:border-b-primary data-[state=active]:bg-white data-[state=active]:shadow-none",
                "dark:data-[state=active]:bg-gray-800 dark:text-gray-300",
                "flex items-center gap-1.5"
              )}
            >
              <ClipboardList className="w-4 h-4" />
              Dépenses
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="statistics"
            className={cn(
              "flex-1 max-w-[200px] rounded-none border-b-2 border-transparent py-3 px-4",
              "data-[state=active]:border-b-primary data-[state=active]:bg-white data-[state=active]:shadow-none",
              "dark:data-[state=active]:bg-gray-800 dark:text-gray-300",
              "flex items-center gap-1.5"
            )}
          >
            <BarChart className="w-4 h-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className={cn(
              "flex-1 max-w-[200px] rounded-none border-b-2 border-transparent py-3 px-4",
              "data-[state=active]:border-b-primary data-[state=active]:bg-white data-[state=active]:shadow-none",
              "dark:data-[state=active]:bg-gray-800 dark:text-gray-300",
              "flex items-center gap-1.5"
            )}
          >
            <FileIcon className="w-4 h-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="p-6 space-y-6">
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
                <Alert variant="default" className="bg-gray-100/80 dark:bg-gray-800/70 border-gray-300/60 dark:border-gray-700/60">
                  <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <AlertTitle className="text-gray-800 dark:text-gray-200 font-medium">Véhicule vendu</AlertTitle>
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
                      className={cn(
                        "gap-2 font-medium",
                        "bg-gray-100 hover:bg-gray-200 text-gray-700",
                        "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300",
                        "border border-gray-300 dark:border-gray-600"
                      )}
                      size="sm"
                      variant="outline"
                      disabled={isGenerating}
                    >
                      <CalendarClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      {isGenerating ? "Génération en cours..." : "Générer les dépenses périodiques"}
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </TabsContent>

        {canAccessExpenses && (
          <TabsContent value="expenses" className="p-6">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <VehicleExpenseContainer vehicleId={vehicle.id} />
            </motion.div>
          </TabsContent>
        )}
        
        <TabsContent value="statistics" className="p-6">
          <VehicleStatisticsTab vehicleId={vehicle.id} />
        </TabsContent>

        <TabsContent value="documents" className="p-6">
          <VehicleDocumentsTab vehicleId={vehicle.id} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
