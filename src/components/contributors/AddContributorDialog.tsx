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
        {/* Style de bouton adapté à l'image fournie, avec couleurs chaudes pour les revenus */}
        <Button className="bg-white text-amber-500 hover:bg-amber-50 border border-amber-200 rounded-xl py-2 px-4 font-medium shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un contributeur</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau contributeur au budget
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {isSubmitting && (
            <div className="space-y-3 my-4">
              <div className="flex items-center justify-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  {/* Cercle animé adapté aux couleurs chaudes */}
                  <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-orange-500 border-b-amber-400 border-l-amber-300 animate-spin"></div>
                  {/* Cercle interne */}
                  <div className="absolute inset-[6px] bg-background rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-amber-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="text-center text-sm font-medium bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Création du contributeur en cours...
              </div>
              <Progress value={progress} className="h-2 w-full bg-amber-100">
                <div className="h-full bg-amber-500 rounded-full"></div>
              </Progress>
            </div>
          )}
          
          <div className={`grid gap-4 py-4 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email (optionnel)</Label>
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contribution">Contribution (€)</Label>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => {
                setNewContributor({ name: "", email: "", total_contribution: "" });
                setIsOpen(false);
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-amber-500 text-white hover:bg-amber-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "En cours..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
