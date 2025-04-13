
import { useState, useEffect, useRef } from "react";
import { Contributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCog, Loader2, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Utilisation du hook useIsMobile pour détecter les dispositifs mobiles
  const isMobile = useIsMobile();
  
  // Responsive détection pour les tablettes
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  // Couleurs du thème quinary
  const colors = {
    gradientFrom: "from-quinary-500",
    gradientTo: "to-yellow-400",
    darkGradientFrom: "dark:from-quinary-600",
    darkGradientTo: "dark:to-yellow-700",
    iconBg: "bg-quinary-100 text-quinary-700 dark:bg-quinary-900/30 dark:text-quinary-300",
    headingText: "text-quinary-800 dark:text-quinary-200",
    descriptionText: "text-quinary-700/80 dark:text-quinary-300/80",
    buttonBg: "bg-quinary-600 hover:bg-quinary-500 dark:bg-quinary-700 dark:hover:bg-quinary-600",
    lightBg: "from-white via-quinary-50/40 to-quinary-100/50",
    darkBg: "dark:from-gray-900 dark:via-quinary-950/20 dark:to-quinary-900/30",
    borderLight: "border-quinary-100/70",
    borderDark: "dark:border-quinary-800/20",
    ringFocus: "focus-visible:ring-quinary-500 dark:focus-visible:ring-quinary-400",
    inputBorder: "border-quinary-200/70 dark:border-gray-700",
    inputBg: "bg-white dark:bg-gray-800"
  };

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

  // Contenu du formulaire partagé entre les versions mobile et desktop
  const renderContent = () => (
    <div 
      ref={contentRef}
      className={cn(
        "relative flex flex-col pb-6 rounded-lg",
        "bg-gradient-to-br",
        colors.lightBg,
        colors.darkBg
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
        colors.gradientFrom,
        colors.gradientTo,
        colors.darkGradientFrom,
        colors.darkGradientTo
      )} />
      
      {/* Radial gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
      
      {/* Bouton de fermeture pour Desktop uniquement (mobile a son propre bouton) */}
      {!isMobile && (
        <DialogClose 
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-20",
            "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      )}
      
      {/* Dialog header */}
      <DialogHeader className="relative z-10 p-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
            <UserCog className="w-5 h-5" />
          </div>
          <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
            {contributor.is_owner ? "Modifier ma contribution" : "Modifier le contributeur"}
          </DialogTitle>
        </div>
        <div className="ml-[52px] mt-2">
          <DialogDescription className={cn("text-base", colors.descriptionText)}>
            {contributor.is_owner 
              ? "Modifiez votre contribution au budget" 
              : "Modifiez les informations et la contribution de ce participant"}
          </DialogDescription>
        </div>
      </DialogHeader>

      {/* Ligne séparatrice stylée */}
      <div className={cn(
        "h-px w-full mb-6",
        "bg-gradient-to-r from-transparent via-quinary-200/60 to-transparent",
        "dark:via-quinary-800/30"
      )} />
      
      {/* Formulaire */}
      <div className="relative z-10 px-6 space-y-6">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-quinary-500 dark:text-quinary-400" />
            <p className="text-quinary-700 dark:text-quinary-300 text-sm font-medium">
              Mise à jour en cours...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {!contributor.is_owner && (
              <>
                <div className="space-y-2">
                  <Label 
                    htmlFor="edit-name"
                    className="text-gray-700 dark:text-gray-300 font-medium"
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
                    placeholder="Nom du contributeur"
                    className={cn(
                      colors.inputBorder, 
                      colors.ringFocus,
                      colors.inputBg
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="edit-email"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Email (optionnel)
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
                    placeholder="adresse@email.com"
                    className={cn(
                      colors.inputBorder, 
                      colors.ringFocus,
                      colors.inputBg
                    )}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label 
                htmlFor="edit-contribution"
                className="text-gray-700 dark:text-gray-300 font-medium"
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
                placeholder="Montant en euros"
                className={cn(
                  colors.inputBorder, 
                  colors.ringFocus,
                  colors.inputBg
                )}
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isSubmitting}
            className={cn(
              "text-white px-6 py-2 rounded-lg",
              colors.buttonBg,
              "relative overflow-hidden"
            )}
          >
            <span className={cn(
              "flex items-center gap-2",
              isSubmitting && "opacity-0"
            )}>
              {contributor.is_owner ? "Mettre à jour ma contribution" : "Mettre à jour"}
            </span>
            {isSubmitting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Élément décoratif */}
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <UserCog className="w-full h-full" />
      </div>
    </div>
  );

  // Version mobile avec Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => {
        if (isSubmitting && !open) return;
        onOpenChange(open);
      }}>
        <SheetContent 
          side="bottom" 
          className={cn(
            "px-0 pt-4 pb-0 rounded-t-xl h-[85vh] border-0",
            "shadow-lg"
          )}
        >
          {/* Indicateur de glissement (drag indicator) */}
          <div className={cn(
            "w-12 h-1.5 rounded-full mx-auto mb-3",
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          )} />
          
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog standard
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Ne pas permettre de fermer pendant la soumission
      if (isSubmitting && !open) return;
      onOpenChange(open);
    }}>
      <DialogContent 
        className={cn(
          "sm:max-w-[550px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
