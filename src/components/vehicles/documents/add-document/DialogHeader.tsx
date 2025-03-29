
import { cn } from "@/lib/utils";
import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadIcon } from "lucide-react";

interface DialogHeaderProps {
  title?: string;
  description?: string;
  colors: Record<string, string>;
}

export const DialogHeader = ({ 
  title = "Ajouter un document", 
  description = "Ajoutez un document à votre véhicule",
  colors 
}: DialogHeaderProps) => {
  return (
    <UIDialogHeader className="relative z-10 mb-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
          <UploadIcon className="w-5 h-5" />
        </div>
        <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
          {title}
        </DialogTitle>
      </div>
      <div className="ml-[52px] mt-2">
        <p className={cn("text-base", colors.descriptionText)}>
          {description}
        </p>
      </div>
    </UIDialogHeader>
  );
};
