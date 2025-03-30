
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { EditIcon, CarIcon } from "lucide-react";

type VehicleEditDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVehicle: Vehicle | null;
  onUpdate: (data: VehicleFormValues) => void;
  isPending: boolean;
};

export const VehicleEditDialog = ({
  isOpen,
  onOpenChange,
  selectedVehicle,
  onUpdate,
  isPending
}: VehicleEditDialogProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

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
  
  // S'assurer que le dialogue reste ouvert tant qu'isOpen est true
  if (isMobile) {
    return (
      <Sheet 
        open={isOpen} 
        onOpenChange={(open) => {
          // Empêcher la fermeture pendant le chargement
          if (isPending && !open) {
            return;
          }
          onOpenChange(open);
        }}
      >
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
          onInteractOutside={(e) => {
            // Empêcher la fermeture par clic extérieur si en chargement
            if (isPending) {
              e.preventDefault();
            }
          }}
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
                  <EditIcon className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                  Modifier le véhicule
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <p className={cn("text-base", colors.descriptionText)}>
                  Modifiez les informations du véhicule sélectionné.
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
              {selectedVehicle && (
                <VehicleForm
                  vehicle={selectedVehicle}
                  onSubmit={onUpdate}
                  onCancel={() => onOpenChange(false)}
                  isPending={isPending}
                />
              )}
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

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Empêcher la fermeture pendant le chargement
        if (isPending && !open) {
          return;
        }
        onOpenChange(open);
      }}
    >
      <DialogContent 
        className={cn(
          "sm:max-w-[550px] p-0 shadow-lg rounded-lg border",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
        onInteractOutside={(e) => {
          // Empêcher la fermeture par clic extérieur si en chargement
          if (isPending) {
            e.preventDefault();
          }
        }}
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
                <EditIcon className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                Modifier le véhicule
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <p className={cn("text-base", colors.descriptionText)}>
                Modifiez les informations du véhicule sélectionné.
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
            {selectedVehicle && (
              <VehicleForm
                vehicle={selectedVehicle}
                onSubmit={onUpdate}
                onCancel={() => onOpenChange(false)}
                isPending={isPending}
              />
            )}
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
