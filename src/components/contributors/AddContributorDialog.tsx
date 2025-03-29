
import { useState, useRef } from "react";
import { NewContributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Plus, X, Users } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddContributorDialogProps {
  onAdd: (contributor: NewContributor) => void;
}

export const AddContributorDialog = ({ onAdd }: AddContributorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newContributor, setNewContributor] = useState<NewContributor>({
    name: "",
    email: "",
    total_contribution: "",
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Responsive détection pour les tablettes
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useIsMobile();

  // Couleurs du thème amber
  const colors = {
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-400",
    darkGradientFrom: "dark:from-amber-600",
    darkGradientTo: "dark:to-yellow-700",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    headingText: "text-amber-900 dark:text-amber-200",
    descriptionText: "text-amber-700/80 dark:text-amber-300/80",
    buttonBg: "bg-amber-600 hover:bg-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600",
    lightBg: "from-white via-amber-50/40 to-amber-100/70",
    darkBg: "dark:from-gray-900 dark:via-amber-950/20 dark:to-amber-900/30",
    borderLight: "border-amber-100/70",
    borderDark: "dark:border-amber-800/20",
    ringFocus: "focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400",
    inputBorder: "border-amber-200/70 dark:border-gray-700",
    inputBg: "bg-white dark:bg-gray-800",
    separator: "via-amber-200/60 dark:via-amber-800/30"
  };

  const handleAdd = async () => {
    if (!newContributor.name || !newContributor.total_contribution) {
      return;
    }
    
    setIsSubmitting(true);
    setProgress(0);
    
    // Animation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 10;
        return nextProgress > 95 ? 95 : nextProgress;
      });
    }, 200);
    
    try {
      await onAdd(newContributor);
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setNewContributor({ name: "", email: "", total_contribution: "" });
        setOpen(false);
        setProgress(0);
        
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-data"],
          exact: false,
          refetchType: 'all'
        });
        queryClient.invalidateQueries({ 
          queryKey: ["contributors"],
          exact: false,
          refetchType: 'all'
        });
      }, 300);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAdd();
  };

  // Composant de formulaire commun aux deux affichages (mobile et desktop)
  const FormContent = () => (
    <>
      {isSubmitting ? (
        <div className="space-y-4 py-5">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500 dark:text-amber-400" />
            <div className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
              Création du contributeur en cours...
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-2 w-full bg-amber-100 dark:bg-gray-700"
            style={{
              "--progress-foreground": isDarkMode ? "#F59E0B" : "#F59E0B"
            } as React.CSSProperties}
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Nom
              </Label>
              <Input
                id="name"
                value={newContributor.name}
                onChange={(e) =>
                  setNewContributor({
                    ...newContributor,
                    name: e.target.value,
                  })
                }
                required
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
                htmlFor="email" 
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Email (optionnel)
              </Label>
              <Input
                id="email"
                type="email"
                value={newContributor.email}
                onChange={(e) =>
                  setNewContributor({
                    ...newContributor,
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
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="contribution" 
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Contribution (€)
            </Label>
            <Input
              id="contribution"
              type="number"
              value={newContributor.total_contribution}
              onChange={(e) =>
                setNewContributor({
                  ...newContributor,
                  total_contribution: e.target.value,
                })
              }
              placeholder="Montant en euros"
              required
              className={cn(
                colors.inputBorder, 
                colors.ringFocus,
                colors.inputBg
              )}
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-3 mt-6">
        <Button 
          variant="outline" 
          type="button"
          onClick={() => {
            setNewContributor({ name: "", email: "", total_contribution: "" });
            setOpen(false);
          }}
          disabled={isSubmitting}
          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        >
          Annuler
        </Button>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "text-white px-6 py-2 rounded-lg",
            colors.buttonBg
          )}
        >
          {isSubmitting ? "En cours..." : "Ajouter"}
        </Button>
      </div>
    </>
  );

  // Contenu du header commun aux deux affichages
  const DialogHeaderContent = () => (
    <>
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
          <UserPlus className="w-5 h-5" />
        </div>
        <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
          Ajouter un contributeur
        </DialogTitle>
      </div>
      <div className="ml-[52px] mt-2">
        <DialogDescription className={cn("text-base", colors.descriptionText)}>
          Ajoutez un nouveau contributeur au budget. Les informations seront mises à jour immédiatement.
        </DialogDescription>
      </div>
    </>
  );

  // Bouton de déclenchement commun
  const TriggerButton = () => (
    <Button 
      onClick={() => setOpen(true)}
      variant="outline"
      className={cn(
        "h-10 px-3 sm:px-4 border transition-all duration-200 rounded-md",
        "hover:scale-[1.02] active:scale-[0.98]",
        // Light mode
        "bg-white border-amber-200 text-amber-600",
        "hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700",
        // Dark mode
        "dark:bg-gray-800 dark:border-amber-800/60 dark:text-amber-400",
        "dark:hover:bg-amber-900/20 dark:hover:border-amber-700 dark:hover:text-amber-300"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 2px 10px -2px rgba(245, 158, 11, 0.15)"
          : "0 2px 10px -2px rgba(245, 158, 11, 0.1)"
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
          "bg-amber-100/80 text-amber-600",
          "dark:bg-amber-800/50 dark:text-amber-300"
        )}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        <span className="font-medium text-sm">Ajouter</span>
      </div>
    </Button>
  );

  // Afficher Sheet sur mobile, Dialog sur desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => {
        if (isSubmitting && !isOpen) return;
        setOpen(isOpen);
      }}>
        <SheetTrigger asChild>
          <TriggerButton />
        </SheetTrigger>
        <SheetContent 
          side="bottom"
          className={cn(
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            colors.borderLight,
            colors.borderDark,
            "max-h-[90vh] overflow-y-auto",
            "dark:bg-gray-900"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />

          <div 
            className={cn(
              "relative flex flex-col pb-6 pt-5",
              "bg-gradient-to-br",
              colors.lightBg,
              colors.darkBg
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
              colors.gradientFrom,
              colors.gradientTo,
              colors.darkGradientFrom,
              colors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-t-lg" />
            
            {/* Dialog header */}
            <DialogHeader className="relative z-10 mb-4 px-6">
              <DialogHeaderContent />
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              colors.separator
            )} />
            
            {/* Section du formulaire */}
            <div className="relative z-10 px-6">
              <form onSubmit={handleFormSubmit}>
                <FormContent />
              </form>
            </div>
            
            {/* Decorative icon */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
              <Users className="w-full h-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isSubmitting && !isOpen) return;
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <TriggerButton />
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <div 
          ref={contentRef}
          className={cn(
            "relative flex flex-col pb-6 p-6 rounded-lg",
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
          
          {/* Bouton de fermeture */}
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
          
          {/* Dialog header */}
          <DialogHeader className="relative z-10 mb-4">
            <DialogHeaderContent />
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10 px-1">
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <FormContent />
            </form>
          </div>

          {/* Decorative icon */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <Users className="w-full h-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
