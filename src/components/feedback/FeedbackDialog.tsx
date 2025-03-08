
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Star, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";

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
  const [step, setStep] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);

  // Textes et émojis pour les différentes notes
  const ratingTexts = [
    "Très insatisfait",
    "Insatisfait",
    "Neutre",
    "Satisfait",
    "Très satisfait"
  ];
  
  const ratingEmojis = ["😠", "😕", "😐", "🙂", "😄"];

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

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (step === 1) {
      setTimeout(() => {
        setStep(2);
      }, 500);
    }
  };

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
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
      setStep(1);

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
              "group relative overflow-hidden transition-all hover:bg-primary/10 dark:hover:bg-primary/20",
              collapsed ? "w-10 p-0 justify-center" : "justify-start px-3 py-2"
            )}
          >
            <MessageSquare className={cn("h-4 w-4 transition-transform group-hover:scale-110", 
              !collapsed && "mr-2")} />
            {!collapsed && (
              <span className="font-normal">Votre avis</span>
            )}
            <span className={cn(
              "absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100",
              collapsed ? "rounded-full" : "rounded-md"
            )} />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-primary/20 shadow-xl dark:shadow-primary/5 backdrop-blur-sm">
          <div className="absolute top-3 right-3 z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-zinc-800/10 dark:hover:bg-white/10" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10 px-6 pt-8 pb-6">
            <div className="flex items-center justify-center mb-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src="/api/placeholder/64/64" alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">FB</AvatarFallback>
              </Avatar>
            </div>
            <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Votre avis compte
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {step === 1 ? 
                "Comment évaluez-vous votre expérience ?" : 
                "Partagez vos impressions pour nous aider à améliorer"}
            </DialogDescription>
          </div>
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-6"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => handleRatingChange(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={cn(
                          "group p-2 h-16 w-16 rounded-xl transition-all duration-200 hover:scale-105",
                          value <= (hoverRating || rating || 0) ? "bg-primary/10" : "bg-transparent"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">{ratingEmojis[value-1]}</span>
                          <Star
                            className={cn(
                              "h-6 w-6 transition-all duration-200",
                              value <= (hoverRating || rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 group-hover:text-gray-400"
                            )}
                          />
                        </div>
                      </Button>
                    ))}
                  </div>
                  {(hoverRating || rating) && (hoverRating || rating) > 0 && (
                    <span className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                      {ratingTexts[(hoverRating || rating || 1) - 1]}
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-6"
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="title" className="text-sm font-medium">Titre</Label>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < (rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <Input
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Résumez votre expérience en quelques mots"
                      className="w-full border-primary/20 focus:border-primary focus:ring-primary/20"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">Détails</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder="Partagez vos suggestions, commentaires ou idées d'amélioration..."
                      className="min-h-[120px] border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-zinc-900/50">
            {step === 2 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="mr-auto"
                disabled={isSubmitting}
              >
                Retour
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (step === 1 && !rating)}
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Envoi...
                </>
              ) : (
                <>
                  {step === 1 ? "Continuer" : "Envoyer"}
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
