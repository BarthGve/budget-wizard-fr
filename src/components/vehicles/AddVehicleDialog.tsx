
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { PlusIcon, Car } from "lucide-react";
import { type VehicleFormValues } from "@/hooks/useVehicleForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

type AddVehicleDialogProps = {
  trigger?: React.ReactNode;
  colorScheme?: "blue" | "green" | "gray";
};

export const AddVehicleDialog = ({ 
  trigger,
  colorScheme = "blue" 
}: AddVehicleDialogProps = {}) => {
  const [open, setOpen] = useState(false);
  const { addVehicle, isAdding } = useVehicles();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Couleurs du thème selon le colorScheme
  const colors = {
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      darkGradientFrom: "dark:from-blue-600",
      darkGradientTo: "dark:to-sky-500",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-200",
      descriptionText: "text-blue-700/80 dark:text-blue-300/80",
      buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
      lightBg: "from-white via-blue-50/40 to-blue-100/70",
      darkBg: "dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30", 
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20",
      separator: "via-blue-200/60 dark:via-blue-800/30"
    },
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-green-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-200",
      descriptionText: "text-green-700/80 dark:text-green-300/80",
      buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
      lightBg: "from-white via-green-50/40 to-green-100/70",
      darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
      borderLight: "border-green-100/70",
      borderDark: "dark:border-green-800/20",
      separator: "via-green-200/60 dark:via-green-800/30"
    },
    gray: {
      gradientFrom: "from-gray-500",
      gradientTo: "to-slate-400",
      darkGradientFrom: "dark:from-gray-600",
      darkGradientTo: "dark:to-slate-500",
      iconBg: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
      headingText: "text-gray-900 dark:text-gray-200",
      descriptionText: "text-gray-700/80 dark:text-gray-300/80",
      buttonBg: "bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600",
      lightBg: "from-white via-gray-50/40 to-gray-100/70",
      darkBg: "dark:from-gray-900 dark:via-gray-950/20 dark:to-gray-800/30",
      borderLight: "border-gray-100/70",
      borderDark: "dark:border-gray-800/20",
      separator: "via-gray-200/60 dark:via-gray-700/30"
    }
  };

  const currentColors = colors[colorScheme];

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
        toast.success("Véhicule ajouté avec succès");
      },
      onError: (error) => {
        console.error("Erreur lors de l'ajout du véhicule:", error);
        toast.error("Erreur lors de l'ajout du véhicule");
      }
    });
  };

  // Version mobile (Sheet)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent 
          side="bottom"
          className={cn(
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            currentColors.borderLight,
            currentColors.borderDark,
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
              currentColors.lightBg,
              currentColors.darkBg
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
              currentColors.gradientFrom,
              currentColors.gradientTo,
              currentColors.darkGradientFrom,
              currentColors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-t-lg" />
            
            {/* Dialog header */}
            <DialogHeader className="relative z-10 mb-4 px-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
                  <PlusIcon className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                  Ajouter un véhicule
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <p className={cn("text-base", currentColors.descriptionText)}>
                  Ajoutez un nouveau véhicule en remplissant les informations ci-dessous.
                </p>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              currentColors.separator
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
              <Car className="w-full h-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop (Dialog)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger || (
        <DialogTrigger asChild>
          <Button className={cn(
            "bg-gradient-to-r shadow-sm",
            currentColors.gradientFrom,
            currentColors.gradientTo,
            "text-white"
          )}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={cn(
        "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
        currentColors.borderLight,
        currentColors.borderDark,
        "dark:bg-gray-900"
      )}>
        <div 
          className={cn(
            "relative flex flex-col pb-6 p-6 rounded-lg",
            "bg-gradient-to-br",
            currentColors.lightBg,
            currentColors.darkBg
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
            currentColors.gradientFrom,
            currentColors.gradientTo,
            currentColors.darkGradientFrom,
            currentColors.darkGradientTo
          )} />

          {/* Radial gradient */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          {/* Dialog header */}
          <DialogHeader className="relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
                <PlusIcon className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                Ajouter un véhicule
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <p className={cn("text-base", currentColors.descriptionText)}>
                Ajoutez un nouveau véhicule en remplissant les informations ci-dessous.
              </p>
            </div>
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            currentColors.separator
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
            <Car className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
