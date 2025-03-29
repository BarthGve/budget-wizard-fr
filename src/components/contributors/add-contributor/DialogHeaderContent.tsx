
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { contributorDialogTheme } from "./theme";

export const DialogHeaderContent = () => {
  const colors = contributorDialogTheme;
  
  return (
    <>
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
          <UserPlus className="w-5 h-5" />
        </div>
        <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
          Ajouter un contributeur
        </DialogTitle>
      </div>
      <div className="ml-[52px] mt-2">
        <DialogDescription className={cn("text-base", colors.descriptionText)}>
          Ajoutez un nouveau contributeur au budget. Les informations seront mises à jour immédiatement.
        </DialogDescription>
      </div>
    </>
  );
};
