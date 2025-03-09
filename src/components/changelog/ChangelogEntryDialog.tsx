
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChangelogEntryForm } from "./ChangelogEntryForm";
import { ChangelogEntry } from "./types";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useChangelogNotification } from "./hooks/useChangelogNotification";
import { NotificationSection } from "./NotificationSection";

interface ChangelogEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: ChangelogEntry | null;
}

export const ChangelogEntryDialog = ({ 
  isOpen, 
  onOpenChange, 
  entry 
}: ChangelogEntryDialogProps) => {
  const { isAdmin } = usePagePermissions();
  const { 
    newlyCreatedEntry, 
    isNotifying, 
    handleNotify, 
    handleFormSuccess, 
    resetNotificationState 
  } = useChangelogNotification();

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Réinitialiser l'état à la fermeture
      resetNotificationState();
    }
    onOpenChange(open);
  };

  const handleClose = () => {
    resetNotificationState();
    onOpenChange(false);
  };

  const handleEntryFormSuccess = (updatedEntry?: ChangelogEntry) => {
    if (!updatedEntry) {
      // Si pas d'entrée reçue (cas improbable), fermer la modale
      onOpenChange(false);
      return;
    }

    // Appeler le hook pour gérer le succès du formulaire
    handleFormSuccess(updatedEntry, !!entry?.id);
    
    // Si c'est une mise à jour, fermer la modale directement
    if (entry?.id) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry ? "Modifier l'entrée" : "Nouvelle entrée"}
          </DialogTitle>
          <DialogDescription>
            {entry ? "Modifiez les détails de cette entrée de changelog" : "Créez une nouvelle entrée de changelog"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Afficher le formulaire si pas d'entrée nouvellement créée */}
        {!newlyCreatedEntry && (
          <ChangelogEntryForm
            initialData={entry}
            onSuccess={handleEntryFormSuccess}
            onCancel={handleClose}
          />
        )}
        
        {/* Utiliser le composant NotificationSection pour l'option de notification après création réussie */}
        {isAdmin && newlyCreatedEntry && (
          <NotificationSection 
            entry={newlyCreatedEntry}
            isNotifying={isNotifying}
            onNotify={handleNotify}
            onClose={handleClose}
          />
        )}
        
        {/* Garder le bouton de notification existant pour les entrées modifiées */}
        {isAdmin && entry && !newlyCreatedEntry && (
          <div className="mt-4 pt-4 border-t flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleNotify(entry.id)}
              disabled={isNotifying}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {isNotifying ? "Envoi en cours..." : "Notifier les utilisateurs"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
