
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangelogEntryForm } from "./ChangelogEntryForm";
import { ChangelogEntry } from "./types";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePagePermissions } from "@/hooks/usePagePermissions";

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

  // Mutation pour notifier les utilisateurs
  const { mutate: notifyUsers, isPending: isNotifying } = useMutation({
    mutationFn: async (id: string) => {
      console.log("Envoi de notification pour l'entrée:", id);
      try {
        const { data, error } = await supabase.functions.invoke("notify-changelog", {
          body: { id, manual: true }
        });
        
        if (error) {
          console.error("Erreur lors de l'invocation de la fonction:", error);
          throw new Error(error.message);
        }
        
        return data;
      } catch (err) {
        console.error("Erreur lors de l'envoi de notification:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Notification envoyée avec succès:", data);
      toast.success("Notification envoyée aux utilisateurs");
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi de notification:", error);
      toast.error("Erreur lors de l'envoi de la notification");
    }
  });

  const handleNotify = () => {
    if (entry?.id) {
      notifyUsers(entry.id);
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
        
        <ChangelogEntryForm
          initialData={entry}
          onSuccess={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
        />
        
        {isAdmin && entry && (
          <div className="mt-4 pt-4 border-t flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNotify}
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
