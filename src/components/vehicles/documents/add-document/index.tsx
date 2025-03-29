
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { useIsMobile } from "@/hooks/use-mobile";
import { DocumentFormValues } from "./DocumentForm";
import { MobileDialog } from "./MobileDialog";
import { DesktopDialog } from "./DesktopDialog";
import { getThemeColors } from "./themeColors";

interface AddDocumentDialogProps {
  vehicleId: string;
}

export const AddDocumentDialog = ({ vehicleId }: AddDocumentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addDocument, isAdding } = useVehicleDocuments(vehicleId);
  const isMobile = useIsMobile();
  const colors = getThemeColors();
  
  const handleSubmit = async (data: DocumentFormValues) => {
    console.log("Soumission du formulaire:", data);
    
    try {
      await addDocument({
        file: data.file,
        document: {
          vehicle_id: vehicleId,
          category_id: data.category_id,
          name: data.name,
          description: data.description,
        }
      });
      
      console.log("Document ajouté avec succès");
      setIsOpen(false);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      return Promise.reject(error);
    }
  };

  // Bouton déclencheur commun
  const triggerButton = (
    <Button className="flex items-center gap-1.5">
      <PlusIcon className="h-4 w-4" />
      Ajouter un document
    </Button>
  );

  // Rendre le dialogue adapté au type d'appareil
  return isMobile ? (
    <MobileDialog
      vehicleId={vehicleId}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSubmit={handleSubmit}
      isAdding={isAdding}
      colors={colors}
    >
      {triggerButton}
    </MobileDialog>
  ) : (
    <DesktopDialog
      vehicleId={vehicleId}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSubmit={handleSubmit}
      isAdding={isAdding}
      colors={colors}
    >
      {triggerButton}
    </DesktopDialog>
  );
};
