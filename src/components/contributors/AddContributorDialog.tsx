import { useState } from "react";
import { NewContributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Plus } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AddContributorDialogProps {
  onAdd: (contributor: NewContributor) => void;
}

export const AddContributorDialog = ({ onAdd }: AddContributorDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newContributor, setNewContributor] = useState<NewContributor>({
    name: "",
    email: "",
    total_contribution: "",
  });
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleAdd = async () => {
    if (!newContributor.name || !newContributor.total_contribution) {
      return;
    }
    
    setIsSubmitting(true);
    setProgress(0);
    
    // Animation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Augmenter progressivement jusqu'à 95% maximum
        // pour donner l'impression que ça charge sans atteindre 100%
        const nextProgress = prev + Math.random() * 10;
        return nextProgress > 95 ? 95 : nextProgress;
      });
    }, 200);
    
    try {
      await onAdd(newContributor);
      // Une fois terminé, passer rapidement à 100%
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset du formulaire et fermeture après une courte pause
      setTimeout(() => {
        setNewContributor({ name: "", email: "", total_contribution: "" });
        setIsOpen(false);
        setProgress(0);
        
        // Forcer une invalidation immédiate de toutes les requêtes liées au dashboard
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Ne pas permettre de fermer pendant la soumission
      if (isSubmitting && !open) return;
      setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setIsOpen(true)}
          variant="outline"
          className={cn(
            "h-10 px-4 border transition-all duration-200 rounded-md",
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
              // Light mode
              "bg-amber-100/80 text-amber-600",
              // Dark mode
              "dark:bg-amber-800/50 dark:text-amber-300"
            )}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-medium text-sm">Ajouter</span>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent 
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
                <UserPlus size={22} />
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
                  Ajouter un contributeur
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
                  Ajoutez un nouveau contributeur au budget
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
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {isSubmitting && (
              <div className="space-y-3 my-4">
                <div className="flex items-center justify-center">
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    {/* Cercle animé adapté aux couleurs jaunes */}
                    <div className={cn(
                      "absolute inset-0 rounded-full border-4 animate-spin",
                      // Light mode
                      "border-t-amber-500 border-r-amber-400 border-b-amber-300 border-l-amber-200",
                      // Dark mode
                      "dark:border-t-amber-400 dark:border-r-amber-500/70 dark:border-b-amber-500/50 dark:border-l-amber-500/30"
                    )}></div>
                    {/* Cercle interne */}
                    <div className={cn(
                      "absolute inset-[6px] rounded-full flex items-center justify-center",
                      // Light mode
                      "bg-white",
                      // Dark mode
                      "dark:bg-slate-900"
                    )}>
                      <Loader2 className={cn(
                        "h-6 w-6 animate-pulse",
                        "text-amber-500",
                        "dark:text-amber-400"
                      )} />
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "text-center text-sm font-medium",
                  // Light mode
                  "text-amber-500",
                  // Dark mode
                  "dark:text-amber-400"
                )}>
                  Création du contributeur en cours...
                </div>
                <Progress 
                  value={progress} 
                  className={cn(
                    "h-2 w-full",
                    "bg-amber-100",
                    "dark:bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "h-full rounded-full",
                    "bg-amber-500",
                    "dark:bg-amber-400"
                  )}></div>
                </Progress>
              </div>
            )}
            
            <div className={`grid gap-5 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nom</Label>
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
                  disabled={isSubmitting}
                  className={cn(
                    "border rounded-md",
                    "focus-visible:ring-amber-500",
                    "dark:focus-visible:ring-amber-400",
                    "border-gray-200 dark:border-gray-700",
                    "bg-white dark:bg-gray-800"
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email (optionnel)</Label>
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
                  disabled={isSubmitting}
                  className={cn(
                    "border rounded-md",
                    "focus-visible:ring-amber-500",
                    "dark:focus-visible:ring-amber-400",
                    "border-gray-200 dark:border-gray-700",
                    "bg-white dark:bg-gray-800"
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contribution" className="text-gray-700 dark:text-gray-300">Contribution (€)</Label>
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
                  required
                  disabled={isSubmitting}
                  className={cn(
                    "border rounded-md",
                    "focus-visible:ring-amber-500",
                    "dark:focus-visible:ring-amber-400",
                    "border-gray-200 dark:border-gray-700",
                    "bg-white dark:bg-gray-800"
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setNewContributor({ name: "", email: "", total_contribution: "" });
                  setIsOpen(false);
                }}
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
                type="submit"
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
                {isSubmitting ? "En cours..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
