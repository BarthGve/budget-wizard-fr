
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Send } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { AnimatePresence } from "framer-motion";
import { FeedbackTrigger } from "./FeedbackTrigger";
import { FeedbackRating, ratingTexts, ratingEmojis } from "./components/FeedbackRating";
import { FeedbackForm } from "./components/FeedbackForm";
import { FeedbackAvatar } from "./components/FeedbackAvatar";
import { useFeedbackSubmit } from "./hooks/useFeedbackSubmit";

interface FeedbackDialogProps {
  collapsed?: boolean;
}

export const FeedbackDialog = ({ collapsed }: FeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const { isSubmitting, submitFeedback } = useFeedbackSubmit();

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3500); // 3.5 secondes

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

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
    
    const success = await submitFeedback(title, content, rating);
    
    if (success) {
      setShowConfetti(true);
      setIsOpen(false);
      setTitle("");
      setContent("");
      setRating(null);
      setStep(1);
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
          <FeedbackTrigger collapsed={collapsed} onClick={() => setIsOpen(true)} />
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-primary/20 shadow-xl dark:shadow-primary/5 backdrop-blur-sm">
          {/* Nous retirons la croix ici car Dialog inclut déjà une croix par défaut */}
          
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10 px-6 pt-8 pb-6">
            <div className="flex items-center justify-center mb-3">
              <FeedbackAvatar />
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
              <FeedbackRating 
                rating={rating} 
                setRating={handleRatingChange}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
              />
            ) : (
              <FeedbackForm 
                rating={rating}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
              />
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
            {/* Le bouton Continuer/Envoyer ne doit s'afficher que dans la première étape si un rating est sélectionné */}
            {(step === 2 || (step === 1 && rating !== null)) && (
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
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
