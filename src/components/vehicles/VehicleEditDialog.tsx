
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { Car, Edit } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

type VehicleEditDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVehicle: Vehicle | null;
  onUpdate: (data: VehicleFormValues) => void;
  isPending: boolean;
  colorScheme?: "blue" | "green" | "gray";
};

export const VehicleEditDialog = ({
  isOpen,
  onOpenChange,
  selectedVehicle,
  onUpdate,
  isPending,
  colorScheme = "green"
}: VehicleEditDialogProps) => {
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

  // S'assurer que le dialogue reste ouvert tant qu'isOpen est true
  // Version mobile (Sheet)
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
            currentColors.borderLight,
            currentColors.borderDark,
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
                  <Edit className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                  Modifier le véhicule
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <p className={cn("text-base", currentColors.descriptionText)}>
                  Modifiez les informations du véhicule sélectionné.
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
              <Car className="w-full h-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop (Dialog)
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
          "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
          currentColors.borderLight,
          currentColors.borderDark,
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
                <Edit className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
                Modifier le véhicule
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <p className={cn("text-base", currentColors.descriptionText)}>
                Modifiez les informations du véhicule sélectionné.
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
            <Car className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
