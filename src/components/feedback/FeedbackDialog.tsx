
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

interface FeedbackDialogProps {
  collapsed?: boolean;
}

export const FeedbackDialog = ({ collapsed }: FeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3500); // 3.5 secondes

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Fonction pour notifier les administrateurs
  const notifyAdmins = async (feedbackId: string) => {
    try {
      const { error } = await supabase.functions.invoke("notify-feedback", {
        body: { feedbackId }
      });
      
      if (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
        // On ne bloque pas le flux principal si la notification échoue
      } else {
        console.log("Notification envoyée aux administrateurs");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de la fonction notify-feedback:", error);
      // On ne bloque pas le flux principal si la notification échoue
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !rating) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Enregistrement du feedback dans la base de données
      const { data: feedback, error } = await supabase.from("feedbacks").insert({
        title: title.trim(),
        content: content.trim(),
        rating,
        profile_id: user.id,
        status: "pending"
      }).select('id').single();

      if (error) throw error;

      // Afficher confirmation avant la notification pour une UX plus réactive
      toast.success("Merci pour votre feedback !");
      setShowConfetti(true); // Activer les confettis
      setIsOpen(false);
      setTitle("");
      setContent("");
      setRating(null);

      // Notification des administrateurs
      if (feedback) {
        await notifyAdmins(feedback.id);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Une erreur est survenue lors de l'envoi du feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button 
      variant="ghost" 
      className={cn(
        "w-full transition-all duration-200 hover:bg-primary/10 group",
        collapsed ? "w-10 px-0 justify-center" : "justify-start"
      )}
    >
      <Send className="h-4 w-4 group-hover:text-primary transition-colors" />
      {!collapsed && (
        <span className="ml-2 font-normal opacity-90 group-hover:opacity-100">
          Laissez-nous un avis
        </span>
      )}
    </Button>
  </DialogTrigger>
  
  <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl border-0 shadow-2xl">
    {/* Header avec gradient */}
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
          <span className="opacity-90">✨</span> Votre avis compte <span className="opacity-90">✨</span>
        </DialogTitle>
        <DialogDescription className="text-center text-base text-white/80 mt-2">
          Aidez-nous à améliorer notre produit en partageant vos impressions
        </DialogDescription>
      </DialogHeader>
    </div>
    
    {/* Contenu */}
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Résumez votre feedback"
          className="w-full rounded-md border border-gray-200 transition-all focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">Feedback</Label>
        <Textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Partagez vos impressions"
          className="min-h-[120px] rounded-md border border-gray-200 resize-none transition-all focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>
     
      <div className="space-y-3">
        <Label className="text-sm font-medium">Votre note</Label>
        <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-2 hover:scale-110 transition-transform focus:outline-none"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  value <= (rating || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 hover:text-gray-400"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
    
    {/* Footer */}
    <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(false)}
        className="px-4 transition-all hover:bg-gray-100"
      >
        Annuler
      </Button>
      
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity shadow-md"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  fill="none" 
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                />
              </svg>
            </span>
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Envoyer mon avis
          </>
        )}
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </>
  );
};
