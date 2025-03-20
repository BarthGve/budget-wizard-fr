
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, PencilIcon, Fuel, CalendarIcon, TagIcon, Car, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleExpenseContainer } from "@/components/vehicles/expenses/VehicleExpenseContainer";
import { FUEL_TYPES } from "@/types/vehicle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { motion } from "framer-motion";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "@/components/vehicles/BrandLogoPreview";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle, isLoading } = useVehicleDetail(id || "");
  const { updateVehicle, isUpdating } = useVehicles();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { canAccessFeature } = usePagePermissions();
  
  // Vérifier si l'utilisateur a accès aux dépenses des véhicules
  const canAccessExpenses = canAccessFeature('/vehicles', 'vehicles_expenses');

  // Important: Nous initialisons le hook avec une chaîne vide par défaut, plutôt que de le mettre dans une condition
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useVehicleBrandLogo(vehicle?.brand || "");
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!vehicle) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-semibold">Véhicule non trouvé</h2>
          <p className="mt-1 text-gray-500">Le véhicule que vous recherchez n'existe pas.</p>
          <Button asChild className="mt-4">
            <Link to="/vehicles">Retour aux véhicules</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdate = (data: VehicleFormValues) => {
    if (vehicle) {
      updateVehicle({
        id: vehicle.id,
        ...data
      });
      setIsEditDialogOpen(false);
    }
  };

  const getFuelTypeLabel = (value: string) => {
    const fuelType = FUEL_TYPES.find(type => type.value === value);
    return fuelType ? fuelType.label : value;
  };
  
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
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/vehicles"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Retour aux véhicules
          </Link>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          variants={itemVariants}
        >
          <h1 className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {/* Logo de la marque à côté du nom du modèle */}
            {vehicle && (
              <BrandLogoPreview
                url={previewLogoUrl}
                isValid={isLogoValid}
                isChecking={isCheckingLogo}
                brand={vehicle.brand}
              />
            )}
            <span>{vehicle?.model || vehicle?.brand}</span>
          </h1>
          <Button onClick={() => setIsEditDialogOpen(true)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Modifier le véhicule
          </Button>
        </motion.div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            {canAccessExpenses && <TabsTrigger value="expenses">Dépenses</TabsTrigger>}
          </TabsList>

          <TabsContent value="details">
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Marque</p>
                        <p className="font-medium">{vehicle.brand}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Modèle</p>
                        <p className="font-medium">{vehicle.model || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Immatriculation</p>
                        <p className="font-medium">{vehicle.registration_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Statut</p>
                        <p className="font-medium">
                          {vehicle.status === 'actif' && <span className="text-green-500">Actif</span>}
                          {vehicle.status === 'inactif' && <span className="text-yellow-500">Inactif</span>}
                          {vehicle.status === 'vendu' && <span className="text-gray-500">Vendu</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date d'acquisition</p>
                        <p className="font-medium">
                          {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type de carburant</p>
                        <p className="font-medium">{getFuelTypeLabel(vehicle.fuel_type)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                {vehicle.photo_url ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Photo du véhicule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-video overflow-hidden rounded-md">
                        <img
                          src={vehicle.photo_url}
                          alt={`${vehicle.brand} ${vehicle.model || ""}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Photo du véhicule</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-48">
                      <Car className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Aucune photo disponible</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
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
      </motion.div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={vehicle}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isPending={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VehicleDetail;
