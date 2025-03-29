
import { NewContributor } from "@/types/contributor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MobileContributorSheet } from "./MobileContributorSheet";
import { DesktopContributorDialog } from "./DesktopContributorDialog";
import { useContributorForm } from "./useContributorForm";

interface AddContributorDialogProps {
  onAdd: (contributor: NewContributor) => Promise<void>;
}

export const AddContributorDialog = ({ onAdd }: AddContributorDialogProps) => {
  // Responsive détection pour les tablettes
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useIsMobile();
  
  const {
    open,
    setOpen,
    isSubmitting,
    progress,
    newContributor,
    setNewContributor,
    handleFormSubmit,
    resetForm,
    isDarkMode,
  } = useContributorForm(onAdd);

  const handleOpenChange = (isOpen: boolean) => {
    if (isSubmitting && !isOpen) return;
    setOpen(isOpen);
  };

  const handleCancel = () => {
    resetForm();
    setOpen(false);
  };

  // Afficher Sheet sur mobile, Dialog sur desktop
  if (isMobile) {
    return (
      <MobileContributorSheet
        open={open}
        onOpenChange={handleOpenChange}
        isSubmitting={isSubmitting}
        progress={progress}
        newContributor={newContributor}
        onContributorChange={setNewContributor}
        onFormSubmit={handleFormSubmit}
        onCancel={handleCancel}
        isDarkMode={isDarkMode}
      />
    );
  }

  // Version desktop avec Dialog
  return (
    <DesktopContributorDialog
      open={open}
      onOpenChange={handleOpenChange}
      isSubmitting={isSubmitting}
      progress={progress}
      newContributor={newContributor}
      onContributorChange={setNewContributor}
      onFormSubmit={handleFormSubmit}
      onCancel={handleCancel}
      isDarkMode={isDarkMode}
      isTablet={isTablet}
    />
  );
};
