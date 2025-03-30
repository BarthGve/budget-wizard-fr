
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { ChangelogEntry } from "./types";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
    <motion.div 
      className="space-y-4 py-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-muted-foreground/20">
        <div className="p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary/20 p-2 rounded-full">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-xl">Entrée créée avec succès</h3>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            Voulez-vous notifier les utilisateurs de cette mise à jour ? Un email leur sera envoyé avec les détails.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isNotifying}
              className="font-medium"
            >
              Non, pas maintenant
            </Button>
            <Button 
              onClick={handleNotify}
              disabled={isNotifying}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 font-medium"
            >
              <Bell className="h-4 w-4" />
              {isNotifying ? "Envoi en cours..." : "Notifier les utilisateurs"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
