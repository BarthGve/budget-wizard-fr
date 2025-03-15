
import { useState, useEffect } from "react";
import { Contributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCog, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface EditContributorDialogProps {
  contributor: Contributor;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (contributor: Contributor) => void;
}

export const EditContributorDialog = ({
  contributor,
  isOpen,
  onOpenChange,
  onUpdate,
}: EditContributorDialogProps) => {
  const [editedContributor, setEditedContributor] = useState<Contributor>({...contributor});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Reset edited contributor when the contributor prop changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setEditedContributor({...contributor});
    }
  }, [contributor, isOpen]);

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    
    try {
      await onUpdate(editedContributor);
      // Attendre un court instant pour donner une sensation de traitement
      setTimeout(() => {
        setIsSubmitting(false);
        onOpenChange(false);
      }, 300);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Ne pas permettre de fermer pendant la soumission
      if (isSubmitting && !open) return;
      onOpenChange(open);
    }}>
      <DialogContent 
        onClick={(e) => e.stopPropagation()} 
        className={cn(
          "p-0 overflow-hidden border-0 shadow-2xl",
          "sm:max-w-[550px]",
          // Light mode
          "bg-white",
          // Dark mode
          "dark:bg-gray-800/95"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.1)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)"
        }}
      >
        {/* En-tête avec dégradé subtil */}
        <div 
          className={cn(
            "relative overflow-hidden",
            // Light mode
            "bg-gradient-to-br from-amber-50 to-white",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-gray-800/90"
          )}
        >
          {/* Cercle décoratif en arrière-plan */}
          <div className={cn(
            "absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20",
            // Light mode
            "bg-gradient-to-br from-amber-400 to-amber-600",
            // Dark mode
            "dark:from-amber-500 dark:to-amber-700 dark:opacity-10"
          )} />

          {/* Header avec contenu amélioré */}
          <div className="px-6 pt-6 pb-4 relative z-10">
            <div className="flex items-start gap-4 mb-2">
              <div className={cn(
                "p-2.5 rounded-xl",
                // Light mode
                "bg-amber-100 text-amber-600",
                // Dark mode
                "dark:bg-amber-800/40 dark:text-amber-400"
              )}>
                <UserCog size={22} />
              </div>
              
              <div className="flex-1">
                <DialogTitle 
                  className={cn(
                    "text-xl font-bold",
                    // Light mode
                    "text-amber-700",
                    // Dark mode
                    "dark:text-amber-300"
                  )}
                >
                  {contributor.is_owner ? "Modifier ma contribution" : "Modifier le contributeur"}
                </DialogTitle>
                
                <DialogDescription 
                  className={cn(
                    "mt-1.5 text-sm",
                    // Light mode
                    "text-amber-600/70",
                    // Dark mode
                    "dark:text-amber-300/70"
                  )}
                >
                  {contributor.is_owner 
                    ? "Modifiez votre contribution au budget"
                    : "Modifiez les informations du contributeur"}
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne séparatrice avec dégradé */}
        <div className={cn(
          "h-px w-full",
          // Light mode
          "bg-gradient-to-r from-transparent via-amber-100 to-transparent",
          // Dark mode
          "dark:from-transparent dark:via-amber-900/30 dark:to-transparent"
        )} />

        {/* Conteneur pour le formulaire */}
        <div className={cn(
          "p-6",
          // Light mode
          "bg-white",
          // Dark mode
          "dark:bg-gray-800/95"
        )}>
          <div className={`grid gap-5 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
            {!contributor.is_owner && (
              <>
                <div className="grid gap-2">
                  <Label 
                    htmlFor="edit-name"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Nom
                  </Label>
                  <Input
                    id="edit-name"
                    value={editedContributor.name}
                    onChange={(e) =>
                      setEditedContributor({
                        ...editedContributor,
                        name: e.target.value,
                      })
                    }
                    className={cn(
                      "border rounded-md",
                      "focus-visible:ring-gray-200",
                      "border-gray-300 dark:border-gray-700",
                      "bg-white dark:bg-gray-800"
                    )}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label 
                    htmlFor="edit-email"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editedContributor.email || ""}
                    onChange={(e) =>
                      setEditedContributor({
                        ...editedContributor,
                        email: e.target.value,
                      })
                    }
                    className={cn(
                      "border rounded-md",
                      "focus-visible:ring-gray-200",
                      "border-gray-300 dark:border-gray-700",
                      "bg-white dark:bg-gray-800"
                    )}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label 
                htmlFor="edit-contribution"
                className="text-gray-700 dark:text-gray-300"
              >
                {contributor.is_owner ? "Votre contribution (€)" : "Contribution (€)"}
              </Label>
              <Input
                id="edit-contribution"
                type="number"
                value={editedContributor.total_contribution}
                onChange={(e) =>
                  setEditedContributor({
                    ...editedContributor,
                    total_contribution: parseFloat(e.target.value) || 0,
                  })
                }
                className={cn(
                  "border rounded-md",
                  "focus-visible:ring-gray-200",
                  "border-gray-300 dark:border-gray-700",
                  "bg-white dark:bg-gray-800"
                )}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
              className={cn(
                "border rounded-md",
                "border-gray-200 text-gray-700",
                "hover:bg-gray-100/70 hover:text-gray-800",
                "dark:border-gray-700 dark:text-gray-300",
                "dark:hover:bg-gray-700/50 dark:hover:text-gray-100"
              )}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isSubmitting}
              className={cn(
                "rounded-md",
                "bg-gradient-to-r from-amber-500 to-amber-600",
                "hover:from-amber-600 hover:to-amber-700",
                "dark:from-amber-600 dark:to-amber-700",
                "dark:hover:from-amber-500 dark:hover:to-amber-600",
                "text-white"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mise à jour...</span>
                </div>
              ) : (
                contributor.is_owner ? "Mettre à jour ma contribution" : "Mettre à jour"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
