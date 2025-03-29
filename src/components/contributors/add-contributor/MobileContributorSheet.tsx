
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { NewContributor } from "@/types/contributor";
import { ContributorFormContent } from "./ContributorFormContent";
import { DialogHeaderContent } from "./DialogHeaderContent";
import { TriggerButton } from "./TriggerButton";
import { contributorDialogTheme } from "./theme";

interface MobileContributorSheetProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isSubmitting: boolean;
  progress: number;
  newContributor: NewContributor;
  onContributorChange: (contributor: NewContributor) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export const MobileContributorSheet = ({
  open,
  onOpenChange,
  isSubmitting,
  progress,
  newContributor,
  onContributorChange,
  onFormSubmit,
  onCancel,
  isDarkMode
}: MobileContributorSheetProps) => {
  const colors = contributorDialogTheme;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (isSubmitting && !isOpen) return;
      onOpenChange(isOpen);
    }}>
      <SheetTrigger asChild>
        <TriggerButton onClick={() => onOpenChange(true)} isDarkMode={isDarkMode} />
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
            <DialogHeaderContent />
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10 px-6">
            <ContributorFormContent 
              isSubmitting={isSubmitting}
              progress={progress}
              newContributor={newContributor}
              onContributorChange={onContributorChange}
              onCancel={onCancel}
              onSubmit={onFormSubmit}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {/* Decorative icon */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <Users className="w-full h-full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
