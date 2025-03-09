
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChangelogEntry } from "../types";

export function useChangelogNotification() {
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
      // Réinitialiser l'état après notification
      setNewlyCreatedEntry(null);
      // Nous ne fermons pas la modale ici car cette logique est maintenant gérée dans NotificationSection
    },
    onError: (error: any) => {
      console.error("[DEBUG] Erreur lors de l'envoi de notification:", error);
      console.error("[DEBUG] Message d'erreur détaillé:", error.message);
      toast.error(`Erreur lors de l'envoi de la notification: ${error.message || "Erreur inconnue"}`);
    }
  });

  const handleNotify = (entryId: string) => {
    if (!entryId) {
      console.error("[DEBUG] Tentative de notification sans ID d'entrée valide");
      toast.error("Impossible d'envoyer la notification: entrée invalide");
      return;
    }
    
    console.log("[DEBUG] Démarrage du processus de notification pour l'entrée:", entryId);
    notifyUsers(entryId);
  };

  const handleFormSuccess = (updatedEntry?: ChangelogEntry, isEditing: boolean = false) => {
    if (!updatedEntry) {
      return null;
    }

    // Si c'est une mise à jour, ne pas stocker l'entrée
    if (isEditing) {
      return updatedEntry;
    }

    // C'est une nouvelle entrée, la stocker pour notification ultérieure
    setNewlyCreatedEntry(updatedEntry);
    return updatedEntry;
  };

  const resetNotificationState = () => {
    setNewlyCreatedEntry(null);
  };

  return {
    newlyCreatedEntry,
    isNotifying,
    handleNotify,
    handleFormSuccess,
    resetNotificationState
  };
}
