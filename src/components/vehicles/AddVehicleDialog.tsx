
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { PlusIcon, CarIcon } from "lucide-react";
import { type VehicleFormValues } from "@/hooks/useVehicleForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

type AddVehicleDialogProps = {
  trigger?: React.ReactNode;
};

export const AddVehicleDialog = ({ trigger }: AddVehicleDialogProps = {}) => {
  const [open, setOpen] = useState(false);
  const { addVehicle, isAdding } = useVehicles();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleSubmit = (data: VehicleFormValues) => {
    // Vérifier que tous les champs requis sont présents
    if (!data.registration_number || !data.brand || !data.acquisition_date || !data.fuel_type) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // S'assurer que toutes les propriétés requises sont présentes
    const vehicleData = {
      registration_number: data.registration_number,
      brand: data.brand,
      model: data.model || "",
      acquisition_date: data.acquisition_date,
      fuel_type: data.fuel_type,
      status: data.status || "actif",
      photo_url: data.photo_url || undefined
    };
    
    addVehicle(vehicleData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  // Couleurs du thème gris
  const colors = {
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-400", 
    darkGradientFrom: "dark:from-gray-600",
    darkGradientTo: "dark:to-gray-500",
    iconBg: "bg-gray-100 text-gray-700 dark:bg-gray-800/80 dark:text-gray-300",
    headingText: "text-gray-800 dark:text-gray-200",
    descriptionText: "text-gray-600/90 dark:text-gray-300/80",
    buttonBg: "bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600",
    lightBg: "from-white via-gray-50/40 to-gray-100/70",
    darkBg: "dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800/80",
    borderLight: "border-gray-100/70",
    borderDark: "dark:border-gray-800/20",
    separator: "via-gray-200/60 dark:via-gray-700/30"
  };

  // Afficher Sheet sur mobile, Dialog sur desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : (
          <SheetTrigger asChild>
            <Button className="flex items-center gap-1.5">
              <PlusIcon className="h-4 w-4" />
              Ajouter un véhicule
            </Button>
          </SheetTrigger>
        )}
        <SheetContent 
          side="bottom"
          className={cn(
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            colors.borderLight,
            colors.borderDark,
            "max-h-[90vh] overflow-y-auto",
            "dark:bg-gray-900"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />

          <div 
            className={cn(
              "relative flex flex-col pb-6 pt-5",
              "bg-gradient-to-br",
              colors.lightBg,
              colors.darkBg
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
              colors.gradientFrom,
              colors.gradientTo,
              colors.darkGradientFrom,
              colors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-t-lg" />
            
            {/* Dialog header */}
            <DialogHeader className="relative z-10 mb-4 px-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
                  <PlusIcon className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                  Ajouter un nouveau véhicule
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <p className={cn("text-base", colors.descriptionText)}>
                  Ajoutez un nouveau véhicule en remplissant les informations ci-dessous.
                </p>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              colors.separator
            )} />
            
            {/* Section du formulaire */}
            <div className="relative z-10 px-6">
              <VehicleForm
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                isPending={isAdding}
              />
            </div>
            
            {/* Decorative icon */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
              <CarIcon className="w-full h-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : (
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </DialogTrigger>
      )}
      <DialogContent 
        className={cn(
          "sm:max-w-[550px] p-0 shadow-lg rounded-lg border",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <div 
          className={cn(
            "relative flex flex-col pb-6 p-6 rounded-lg",
            "bg-gradient-to-br",
            colors.lightBg,
            colors.darkBg
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
            colors.gradientFrom,
            colors.gradientTo,
            colors.darkGradientFrom,
            colors.darkGradientTo
          )} />

          {/* Radial gradient */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          {/* Dialog header */}
          <DialogHeader className="relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
                <PlusIcon className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                Ajouter un nouveau véhicule
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <p className={cn("text-base", colors.descriptionText)}>
                Ajoutez un nouveau véhicule en remplissant les informations ci-dessous.
              </p>
            </div>
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10">
            <VehicleForm
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
              isPending={isAdding}
            />
          </div>
          
          {/* Decorative icon */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <CarIcon className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
