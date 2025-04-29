
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher Chrome d'afficher automatiquement la notification d'installation
      e.preventDefault();
      // Stocker l'événement pour pouvoir le déclencher plus tard
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mettre à jour l'état pour indiquer que l'application est installable
      setIsInstallable(true);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      // Effacer le prompt différé car il n'est plus nécessaire
      setDeferredPrompt(null);
      // Masquer le bouton d'installation
      setIsInstallable(false);
      // Afficher un message de confirmation
      toast({
        title: "Installation réussie",
        description: "L'application a été installée avec succès.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Nettoyer les écouteurs d'événements
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Afficher le prompt d'installation
    await deferredPrompt.prompt();

    // Attendre la décision de l'utilisateur
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('L\'utilisateur a accepté l\'installation');
      toast({
        title: "Installation en cours",
        description: "Merci d'avoir installé Budget Wizard!",
      });
    } else {
      console.log('L\'utilisateur a refusé l\'installation');
    }
    
    // Effacer le prompt différé, il ne peut être utilisé qu'une fois
    setDeferredPrompt(null);
  };

  // Ne pas afficher le bouton si l'application n'est pas installable
  if (!isInstallable) return null;

  return (
    <Button 
      onClick={handleInstallClick}
      variant="outline"
      className="flex items-center gap-2 bg-primary/80 text-primary-foreground hover:bg-primary/90 border-none"
    >
      <Download size={16} />
      Installer l'application
    </Button>
  );
};
