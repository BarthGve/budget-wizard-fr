import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  const { data: profileData } = useProfileAvatar();
  const { currentUser } = useCurrentUser();

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
      if (!currentUser) throw new Error("Non authentifié");

      const { data: feedback, error } = await supabase.from("feedbacks").insert({
        title: title.trim(),
        content: content.trim(),
        rating,
        profile_id: currentUser.id,
        status: "pending"
      }).select('id').single();

      if (error) throw error;

      toast.success("Merci pour votre feedback !");
      setShowConfetti(true);
      setIsOpen(false);
      setTitle("");
      setContent("");
      setRating(null);
      setStep(1);

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

  const getInitials = () => {
    if (!currentUser?.email) return "FB";
    
    const email = currentUser.email;
    const nameParts = email.split('@')[0].split(/[._-]/);
    
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
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
              "group relative w-full flex items-center px-4 py-2 rounded-lg transition-colors",
              "hover:bg-primary/10",
              collapsed && "justify-center px-0",
              !collapsed && "justify-start"
            )}
          >
            <MessageSquare className={cn(
              "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
              !collapsed && "mr-2"
            )} />
            {!collapsed && (
              <span className="truncate">Votre avis</span>
            )}
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
              <span className="sr-only">Fermer</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10 px-6 pt-8 pb-6">
            <div className="flex items-center justify-center mb-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                {profileData?.avatar_url ? (
                  <AvatarImage src={profileData.avatar_url} alt="Avatar utilisateur" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
                )}
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
