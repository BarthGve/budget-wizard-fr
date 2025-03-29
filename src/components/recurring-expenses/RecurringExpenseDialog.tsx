
import { useState } from "react";
import { MobileSheet } from "./dialog/MobileSheet";
import { DesktopDialog } from "./dialog/DesktopDialog";
import { RecurringExpense } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecurringExpenseDialogProps {
  expense?: RecurringExpense;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialVehicleId?: string;
}

/**
 * Composant principal pour l'affichage du dialogue des charges récurrentes
 * Affiche un Sheet sur mobile et un Dialog sur desktop
 */
export function RecurringExpenseDialog({ 
  expense, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialVehicleId
}: RecurringExpenseDialogProps) {
  // État contrôlé ou non contrôlé
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  // Vérifier si nous sommes sur mobile
  const isMobile = useIsMobile();
  
  // Déterminer si nous sommes en mode édition
  const isEditMode = !!expense;
  
  // Forcer le défilement pour le formulaire avec les champs véhicule
  const needsScrolling = true;

  // Afficher la version appropriée selon la taille d'écran
  if (isMobile) {
    return (
      <MobileSheet
        expense={expense}
        open={open}
        onOpenChange={onOpenChange}
        isEditMode={isEditMode}
        needsScrolling={needsScrolling}
        trigger={trigger}
        initialVehicleId={initialVehicleId}
      />
    );
  }

  // Version desktop avec Dialog
  return (
    <DesktopDialog 
      expense={expense}
      open={open}
      onOpenChange={onOpenChange}
      isEditMode={isEditMode}
      needsScrolling={needsScrolling}
      trigger={trigger}
      initialVehicleId={initialVehicleId}
    />
  );
}
