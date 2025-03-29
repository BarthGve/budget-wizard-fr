
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogHeader } from "./DialogHeader";
import { DocumentForm, DocumentFormValues } from "./DocumentForm";
import { DialogContainer } from "./DialogContainer";

interface DesktopDialogProps {
  vehicleId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onSubmit: (data: DocumentFormValues) => Promise<void>;
  isAdding: boolean;
  colors: Record<string, string>;
}

export const DesktopDialog = ({
  vehicleId,
  isOpen,
  onOpenChange,
  children,
  onSubmit,
  isAdding,
  colors
}: DesktopDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "sm:max-w-[550px] p-0 shadow-lg rounded-lg border",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <DialogContainer colors={colors}>
          {/* En-tête du dialogue */}
          <DialogHeader colors={colors} />
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Formulaire */}
          <DocumentForm 
            vehicleId={vehicleId}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isAdding={isAdding}
          />
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};
