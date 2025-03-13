import { useState } from "react";
import { NewContributor } from "@/types/contributor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [open, setOpen] = useState(false);
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isSubmitting && !isOpen) return;
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setOpen(true)}
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
              "bg-amber-100/80 text-amber-600",
              "dark:bg-amber-800/50 dark:text-amber-300"
            )}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-medium text-sm">Ajouter</span>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] overflow-hidden">
        {/* Background gradient subtil */}
        <div className={cn(
          "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br",
          "from-amber-500 to-amber-400",
          "dark:from-amber-600 dark:to-amber-500"
        )} />
        
        {/* Fond radial gradient ultra-subtil */}
        <div className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
          "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]"
        )} />
        
        <DialogHeader className="relative z-10 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-lg",
              "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
            )}>
              <UserPlus className="w-5 h-5" />
            </div>
            <DialogTitle className={cn(
              "text-2xl font-bold",
              "text-amber-900 dark:text-amber-200"
            )}>
              Ajouter un contributeur
            </DialogTitle>
          </div>
          
          <div className="ml-[52px]"> {/* Aligné avec l'icône + le texte du titre */}
            <DialogDescription className={cn(
              "mt-1.5 text-base",
              "text-amber-700/80 dark:text-amber-300/80"
            )}>
              Ajoutez un nouveau contributeur au budget. Les informations seront mises à jour immédiatement.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        {/* Séparateur subtil */}
        <div className={cn(
          "w-full h-px mb-5 relative z-10",
          "bg-gradient-to-r from-transparent via-gray-200 to-transparent",
          "dark:via-gray-700"
        )} />
        
        {/* Section du formulaire */}
        <div className="relative z-10">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {isSubmitting && (
              <div className="space-y-3 my-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-amber-500 dark:text-amber-400" />
                </div>
                <div className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
                  Création du contributeur en cours...
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 w-full bg-amber-100 dark:bg-gray-700"
                >
                  <div className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"></div>
                </Progress>
              </div>
            )}
            
            <div className={`space-y-5 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
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
                  disabled={isSubmitting}
                  className="border-gray-200 dark:border-gray-700 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
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
                  disabled={isSubmitting}
                  className="border-gray-200 dark:border-gray-700 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contribution" className="text-gray-700 dark:text-gray-300">
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
                  required
                  disabled={isSubmitting}
                  className="border-gray-200 dark:border-gray-700 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setNewContributor({ name: "", email: "", total_contribution: "" });
                  setOpen(false);
                }}
                disabled={isSubmitting}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Annuler
              </Button>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
                  "dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-500 dark:hover:to-amber-600",
                  "text-white shadow-sm"
                )}
              >
                {isSubmitting ? "En cours..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Décoration graphique dans le coin inférieur droit */}
        <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] z-0">
          <UserPlus className="w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
