
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Send, LightbulbIcon } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { AnimatePresence } from "framer-motion";
import { ContributionTrigger } from "./ContributionTrigger";
import { ContributionAvatar } from "./ContributionAvatar";
import { ContributionForm } from "./ContributionForm";
import { useContributionSubmit } from "./hooks/useContributionSubmit";

interface ContributionDialogProps {
  collapsed?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ContributionDialog = ({ 
  collapsed, 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange 
}: ContributionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("suggestion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const { isSubmitting, submitContribution } = useContributionSubmit();

  // Utiliser les props externes si fournies, sinon utiliser l'état local
  const dialogOpen = externalOpen !== undefined ? externalOpen : isOpen;
  const handleOpenChange = (open: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(open);
    } else {
      setIsOpen(open);
    }
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3500); // 3.5 secondes

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleSubmit = async () => {
    const success = await submitContribution(type, title, content);
    
    if (success) {
      setShowConfetti(true);
      handleOpenChange(false);
      setType("suggestion");
      setTitle("");
      setContent("");
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
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        {!externalOpen && (
          <DialogTrigger asChild>
            <ContributionTrigger collapsed={collapsed} onClick={() => handleOpenChange(true)} />
          </DialogTrigger>
        )}
        
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-primary/20 shadow-xl dark:shadow-primary/5 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/10 px-6 pt-8 pb-6">
            <div className="flex items-center justify-center mb-3">
              <ContributionAvatar />
            </div>
            <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Contribuez au projet
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Partagez vos idées et suggestions pour améliorer BudgetWizard
            </DialogDescription>
          </div>
          
          <ContributionForm 
            type={type}
            setType={setType}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
          />
          
          <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-zinc-900/50">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Envoi...
                </>
              ) : (
                <>
                  Envoyer
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
