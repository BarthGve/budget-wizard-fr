
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";

interface ContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Types de contributions disponibles
const contributionTypes = [
  { id: "feature", label: "Nouvelle fonctionnalité" },
  { id: "improvement", label: "Amélioration" },
  { id: "bugfix", label: "Correction de bug" },
  { id: "design", label: "Design/UI" },
  { id: "performance", label: "Performance" },
  { id: "other", label: "Autre" }
];

export const ContributionDialog = ({ open, onOpenChange }: ContributionDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useCurrentUser();

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("");
  };

  const handleSubmit = async () => {
    // Validation du formulaire
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre");
      return;
    }
    if (!content.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }
    if (!type) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Envoi de la contribution à Supabase
      const { error } = await supabase.from("contributions").insert({
        profile_id: currentUser?.id,
        title: title.trim(),
        content: content.trim(),
        type,
        status: "pending" // Statut par défaut: à traiter
      });

      if (error) throw error;
      
      toast.success("Merci pour votre contribution!");
      resetForm();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la contribution:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Contribuez au projet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Catégorie</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {contributionTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <input
              id="title"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Résumez votre idée en quelques mots"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Détails</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre suggestion ou idée en détail..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
