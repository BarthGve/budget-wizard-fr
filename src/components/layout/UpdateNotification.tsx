
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToastWrapper } from "@/hooks/useToastWrapper";
import { updateServiceWorker } from '@/registerSW';
import { RefreshCw } from 'lucide-react';

export const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToastWrapper();

  useEffect(() => {
    // Écouter l'événement déclenché lorsqu'une mise à jour est disponible
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
      
      // Afficher un toast pour informer l'utilisateur
      toast({
        title: "Mise à jour disponible",
        description: "Une nouvelle version de l'application est disponible. Cliquez pour rafraîchir.",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdateClick}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Mettre à jour
          </Button>
        ),
        duration: 0, // Le toast reste jusqu'à l'action de l'utilisateur
      });
    };

    // Enregistrer l'écouteur d'événements
    window.addEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable);

    // Nettoyer l'écouteur d'événements lors du démontage
    return () => {
      window.removeEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable);
    };
  }, [toast]);

  // Gérer le clic sur le bouton de mise à jour
  const handleUpdateClick = () => {
    // Appliquer la mise à jour en activant le nouveau service worker
    updateServiceWorker();
    setUpdateAvailable(false);
  };

  // Le composant ne rend rien visuellement, il gère uniquement les notifications
  return null;
};
