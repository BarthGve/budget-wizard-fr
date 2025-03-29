
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X, Users } from "lucide-react";
import { NewContributor } from "@/types/contributor";
import { ContributorFormContent } from "./ContributorFormContent";
import { DialogHeaderContent } from "./DialogHeaderContent";
import { TriggerButton } from "./TriggerButton";
import { contributorDialogTheme } from "./theme";
import { useRef } from "react";

interface DesktopContributorDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isSubmitting: boolean;
  progress: number;
  newContributor: NewContributor;
  onContributorChange: (contributor: NewContributor) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  isTablet: boolean;
}

export const DesktopContributorDialog = ({
  open,
  onOpenChange,
  isSubmitting,
  progress,
  newContributor,
  onContributorChange,
  onFormSubmit,
  onCancel,
  isDarkMode,
  isTablet
}: DesktopContributorDialogProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const colors = contributorDialogTheme;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isSubmitting && !isOpen) return;
      onOpenChange(isOpen);
    }}>
      <DialogTrigger asChild>
        <TriggerButton onClick={() => onOpenChange(true)} isDarkMode={isDarkMode} />
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <div 
          ref={contentRef}
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
          
          {/* Bouton de fermeture */}
          <DialogClose 
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-20",
              "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {/* Dialog header */}
          <DialogHeader className="relative z-10 mb-4">
            <DialogHeaderContent />
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10 px-1">
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
      </DialogContent>
    </Dialog>
  );
};
