
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangelogEntryForm } from "./ChangelogEntryForm";
import { ChangelogEntry } from "./types";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Mail } from "lucide-react";

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
  const [isNotifying, setIsNotifying] = useState(false);

  // Mutation pour notifier les utilisateurs
  const { mutate: notifyUsers } = useMutation({
    mutationFn: async (id: string) => {
      setIsNotifying(true);
      
      // Ajout d'un toast pour indiquer que l'envoi a commencé
      toast.info("Envoi des notifications en cours...");
      
      console.log("Appel de la fonction Edge notify-changelog avec ID:", id);
      const { data, error } = await supabase.functions.invoke("notify-changelog", {
        body: { id, manual: true }
      });
      
      console.log("Réponse de la fonction notify-changelog:", data, error);
      
      if (error) {
        console.error("Erreur lors de l'appel à notify-changelog:", error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Notification envoyée avec succès:", data);
      
      // Afficher un message approprié en fonction des données renvoyées
      if (data.message?.includes("Aucun utilisateur")) {
        toast.info("Aucun utilisateur à notifier");
      } else {
        toast.success("Notification envoyée aux utilisateurs avec succès");
      }
      
      setIsNotifying(false);
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi des notifications:", error);
      toast.error("Erreur lors de l'envoi des notifications. Vérifiez la console pour plus d'informations.");
      setIsNotifying(false);
    }
  });

  // Fonction pour gérer le clic sur le bouton de notification
  const handleNotifyClick = () => {
    if (entry?.id) {
      console.log("Démarrage de la notification pour l'entrée:", entry.id);
      notifyUsers(entry.id);
    } else {
      console.error("Impossible d'envoyer la notification: ID d'entrée manquant");
      toast.error("Impossible d'envoyer la notification: ID d'entrée manquant");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry ? "Modifier l'entrée" : "Nouvelle entrée"}
          </DialogTitle>
        </DialogHeader>
        
        {entry && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleNotifyClick}
              disabled={isNotifying}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isNotifying ? "Envoi en cours..." : "Notifier les utilisateurs"}
            </Button>
          </div>
        )}
        
        <ChangelogEntryForm
          initialData={entry}
          onSuccess={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
