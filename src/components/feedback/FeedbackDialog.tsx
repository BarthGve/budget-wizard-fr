
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
