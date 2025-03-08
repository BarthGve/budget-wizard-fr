
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';

interface ContributionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTRIBUTION_TYPES = [
  { id: "feature", name: "Nouvelle fonctionnalité" },
  { id: "improvement", name: "Amélioration" },
  { id: "bug", name: "Bug" },
  { id: "idea", name: "Idée" },
  { id: "other", name: "Autre" }
];

export const ContributionDialog = ({ isOpen, onOpenChange }: ContributionDialogProps) => {
  const { user } = useCurrentUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !type) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Insérer la contribution dans la base de données
      const { error } = await supabase
        .from('contributions')
        .insert({
          profile_id: user?.id,
          title,
          content,
          type,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success("Votre contribution a été soumise avec succès !");
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la soumission de la contribution:", error);
      toast.error("Une erreur est survenue lors de la soumission. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contribuez au projet</DialogTitle>
          <DialogDescription>
            Partagez vos idées, suggestions ou signalez des problèmes pour nous aider à améliorer l'application.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="contribution-type">Catégorie</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger id="contribution-type">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CONTRIBUTION_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contribution-title">Titre</Label>
            <Input
              id="contribution-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de votre contribution"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution-content">Message</Label>
            <Textarea
              id="contribution-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre idée ou le problème rencontré en détail..."
              className="min-h-[120px]"
              required
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
