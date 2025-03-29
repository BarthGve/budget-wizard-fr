
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DialogHeader } from "./DialogHeader";
import { DocumentForm, DocumentFormValues } from "./DocumentForm";

interface MobileDialogProps {
  vehicleId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onSubmit: (data: DocumentFormValues) => Promise<void>;
  isAdding: boolean;
  colors: Record<string, string>;
}

export const MobileDialog = ({ 
  vehicleId, 
  isOpen, 
  onOpenChange, 
  children,
  onSubmit,
  isAdding,
  colors
}: MobileDialogProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
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
        {/* Indicateur de défilement */}
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
          
          {/* En-tête du dialogue */}
          <div className="px-6">
            <DialogHeader colors={colors} />
          </div>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10 px-6">
            <DocumentForm 
              vehicleId={vehicleId}
              onSubmit={onSubmit}
              onCancel={() => onOpenChange(false)}
              isAdding={isAdding}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
