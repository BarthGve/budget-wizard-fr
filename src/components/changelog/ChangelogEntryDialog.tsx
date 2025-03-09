
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
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useState } from "react";

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
  // État pour suivre l'entrée nouvellement créée (pour l'option de notification)
  const [newlyCreatedEntry, setNewlyCreatedEntry] = useState<ChangelogEntry | null>(null);

  // Mutation pour notifier les utilisateurs
  const { mutate: notifyUsers, isPending: isNotifying } = useMutation({
    mutationFn: async (id: string) => {
      console.log("[DEBUG] Début de l'envoi de notification pour l'entrée:", id);
      
      // Vérification préliminaire
      if (!id) {
        console.error("[DEBUG] ID d'entrée manquant");
        throw new Error("ID d'entrée manquant");
      }

      const payload = { id, manual: true };
      console.log("[DEBUG] Payload pour la fonction Edge:", JSON.stringify(payload));
      
      try {
        // Appel de la fonction Edge avec monitoring détaillé
        console.log("[DEBUG] Avant l'appel à supabase.functions.invoke");
        const { data, error } = await supabase.functions.invoke("notify-changelog", {
          body: payload
        });
        
        if (error) {
          console.error("[DEBUG] Erreur retournée par la fonction Edge:", error);
          console.error("[DEBUG] Message d'erreur:", error.message);
          console.error("[DEBUG] Détails supplémentaires:", error.context || "Aucun détail supplémentaire");
          throw new Error(`Erreur lors de l'invocation: ${error.message}`);
        }
        
        console.log("[DEBUG] Réponse de la fonction Edge:", data);
        return data;
      } catch (err: any) {
        console.error("[DEBUG] Exception lors de l'appel de la fonction Edge:", err);
        console.error("[DEBUG] Message d'erreur:", err.message);
        console.error("[DEBUG] Stack trace:", err.stack);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("[DEBUG] Notification envoyée avec succès:", data);
      toast.success("Notification envoyée aux utilisateurs");
      // Réinitialiser l'état et fermer la modale après notification
      setNewlyCreatedEntry(null);
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("[DEBUG] Erreur lors de l'envoi de notification:", error);
      console.error("[DEBUG] Message d'erreur détaillé:", error.message);
      toast.error(`Erreur lors de l'envoi de la notification: ${error.message || "Erreur inconnue"}`);
    }
  });

  const handleNotify = () => {
    if (!newlyCreatedEntry?.id) {
      console.error("[DEBUG] Tentative de notification sans ID d'entrée valide");
      toast.error("Impossible d'envoyer la notification: entrée invalide");
      return;
    }
    
    console.log("[DEBUG] Démarrage du processus de notification pour l'entrée:", newlyCreatedEntry.id);
    notifyUsers(newlyCreatedEntry.id);
  };

  const handleFormSuccess = (updatedEntry?: ChangelogEntry) => {
    if (!updatedEntry) {
      // Si pas d'entrée reçue (cas improbable), fermer la modale
      onOpenChange(false);
      return;
    }

    // Si c'est une mise à jour, fermer la modale directement
    if (entry?.id) {
      onOpenChange(false);
      return;
    }

    // C'est une nouvelle entrée, mettre à jour l'état mais ne pas fermer la modale
    setNewlyCreatedEntry(updatedEntry);
  };

  const handleCloseWithoutNotify = () => {
    setNewlyCreatedEntry(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Réinitialiser l'état à la fermeture
        setNewlyCreatedEntry(null);
      }
      onOpenChange(open);
    }}>
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
            onSuccess={handleFormSuccess}
            onCancel={() => {
              onOpenChange(false);
            }}
          />
        )}
        
        {/* Afficher l'option de notification après création réussie */}
        {isAdmin && newlyCreatedEntry && (
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/20">
              <h3 className="font-medium text-base mb-2">
                ✅ Entrée créée avec succès
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Souhaitez-vous notifier les utilisateurs de cette mise à jour ?
              </p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCloseWithoutNotify}
                  disabled={isNotifying}
                >
                  Non, pas maintenant
                </Button>
                <Button 
                  onClick={handleNotify}
                  disabled={isNotifying}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Bell className="h-4 w-4" />
                  {isNotifying ? "Envoi en cours..." : "Notifier les utilisateurs"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Garder le bouton de notification existant pour les entrées modifiées */}
        {isAdmin && entry && !newlyCreatedEntry && (
          <div className="mt-4 pt-4 border-t flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => notifyUsers(entry.id)}
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
