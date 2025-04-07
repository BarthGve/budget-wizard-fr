
/**
 * Wrapper unifié pour les toasts dans l'application
 * Filtre les messages de succès et n'affiche que les erreurs
 */
import { toast as sonnerToast } from "sonner";
import { toast as uiToast, useToast as useUIToast } from "@/hooks/use-toast";

// Fonction pour déterminer si on doit afficher un toast basé sur le type
const shouldShowToast = (type: "success" | "error" | "info" | "warning"): boolean => {
  // On n'affiche que les toasts d'erreur
  return type === "error";
};

// API compatible avec Sonner
export const toast = {
  // Les fonctions success ne font rien (pour supprimer les messages de succès)
  success: (message: string, options?: any) => {
    // Ne fait rien, les toasts de succès sont désactivés
    return null;
  },
  
  // Les fonctions error sont conservées
  error: (message: string, options?: any) => {
    return sonnerToast.error(message, options);
  },
  
  // Autres fonctions de toast disponibles mais filtrées
  info: (message: string, options?: any) => {
    if (shouldShowToast("info")) {
      return sonnerToast.info(message, options);
    }
    return null;
  },
  
  warning: (message: string, options?: any) => {
    if (shouldShowToast("warning")) {
      return sonnerToast.warning(message, options);
    }
    return null;
  },
  
  // Méthode custom pour les cas particuliers
  custom: (opts: any) => {
    return sonnerToast.custom(opts);
  },
  
  // Méthode promise pour les chargements asynchrones
  promise: (promise: Promise<any>, opts: any) => {
    // Si les options contiennent un message de succès, on le supprime
    if (opts?.success && !shouldShowToast("success")) {
      opts.success = undefined;
    }
    return sonnerToast.promise(promise, opts);
  },
  
  dismiss: (toastId?: string) => {
    return sonnerToast.dismiss(toastId);
  }
};

// Hook compatible avec l'API Shadcn UI Toast
export const useToastWrapper = () => {
  const uiToastHook = useUIToast();
  
  return {
    ...uiToastHook,
    toast: {
      ...uiToastHook.toast,
      // On surcharge la fonction par défaut pour filtrer les toasts
      default: (props: any) => {
        if (props.variant === "destructive" || shouldShowToast(props.type || "info")) {
          return uiToastHook.toast(props);
        }
        return { id: "", dismiss: () => {}, update: () => {} };
      },
      // Méthode error conservée
      error: (props: any) => {
        return uiToastHook.toast({
          ...props,
          variant: "destructive"
        });
      },
      // Méthode success supprimée
      success: (props: any) => {
        // Ne fait rien, succès désactivé
        return { id: "", dismiss: () => {}, update: () => {} };
      }
    }
  };
};

// Réexporte la fonction d'utilitaire handleError pour la centraliser
export const handleError = (error: any, defaultMessage: string) => {
  const errorMessage = error?.message || defaultMessage;
  toast.error(errorMessage);
  return errorMessage;
};

// Réexporte showSuccess qui ne fait plus rien
export const showSuccess = (message: string) => {
  // Ne montre plus de message de succès, retourne juste le message
  return message;
};
