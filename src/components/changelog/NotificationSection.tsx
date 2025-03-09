
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ChangelogEntry } from "./types";

interface NotificationSectionProps {
  entry: ChangelogEntry;
  isNotifying: boolean;
  onNotify: (id: string) => void;
  onClose: () => void;
}

export const NotificationSection: FC<NotificationSectionProps> = ({
  entry,
  isNotifying,
  onNotify,
  onClose
}) => {
  // Nouvelle fonction de gestion combinée
  const handleNotify = () => {
    onNotify(entry.id);
    // Fermer la modale après avoir lancé la notification
    // La notification se fait en arrière-plan, donc on peut fermer tout de suite
    onClose();
  };

  return (
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
            onClick={onClose}
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
  );
};
