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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTRIBUTION_TYPES = [
  { id: "feature", name: "Nouvelle fonctionnalité" },
  { id: "improvement", name: "Amélioration" },
  { id: "bug", name: "Bug" },
  { id: "idea", name: "Idée" },
  { id: "other", name: "Autre" }
];

export function ContributionDialog({ open, onOpenChange }: ContributionDialogProps) {
  const { currentUser } = useCurrentUser();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setCategory('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase.from("contributions").insert({
        profile_id: currentUser?.id,
        title,
        content: message,
        type: category,
        status: "pending"
      });
      
      if (error) throw error;
      
      toast({
        title: "Contribution envoyée",
        description: "Merci pour votre proposition !",
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la contribution:", error);
      toast({
        title: "Une erreur est survenue",
        description: "Impossible d'envoyer votre contribution. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Select value={category} onValueChange={setCategory} required>
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
