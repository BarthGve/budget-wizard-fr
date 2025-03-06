
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangelogEntryForm } from "./ChangelogEntryForm";
import { ChangelogEntry } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface ChangelogEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: ChangelogEntry | null;
}

export function ChangelogEntryDialog({
  isOpen,
  onOpenChange,
  entry,
}: ChangelogEntryDialogProps) {
  const queryClient = useQueryClient();
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["changelog"] });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };
  
  const handleSendNotification = async () => {
    if (!entry?.id) return;
    
    setIsSendingNotification(true);
    try {
      const { data, error } = await supabase.functions.invoke("notify-changelog", {
        body: { changelogEntryId: entry.id }
      });
      
      if (error) {
        console.error("Erreur lors de l'envoi des notifications:", error);
        toast.error("Erreur lors de l'envoi des notifications");
        return;
      }
      
      toast.success("Notifications envoyées avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue lors de l'envoi des notifications");
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Modifier une entrée" : "Ajouter une entrée"}
          </DialogTitle>
          <DialogDescription>
            {entry
              ? "Modifier les détails de cette entrée du changelog"
              : "Ajouter une nouvelle entrée au changelog de l'application"}
          </DialogDescription>
        </DialogHeader>

        {/* Bouton de notification (uniquement pour les entrées existantes) */}
        {entry && (
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleSendNotification}
              disabled={isSendingNotification}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSendingNotification 
                ? "Envoi des notifications..." 
                : "Notifier les utilisateurs de cette mise à jour"}
            </Button>
          </div>
        )}

        <ChangelogEntryForm
          initialData={entry ?? undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
