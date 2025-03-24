
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckIcon, ChevronLeft, ChevronRight, Settings2, UserRound, Store, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Contenu des étapes d'onboarding
  const steps = [
    {
      title: "Bienvenue sur Budget Wizard !",
      icon: <UserRound className="h-12 w-12 text-indigo-500" />,
      description: "Suivez ce guide rapide pour configurer votre application et tirer le meilleur parti de votre gestion financière.",
      skipText: "Commencer",
    },
    {
      title: "Ajoutez vos revenus",
      icon: <CreditCard className="h-12 w-12 text-emerald-500" />,
      description: "Commencez par renseigner vos sources de revenus. C'est essentiel pour analyser vos finances et définir des objectifs d'épargne réalistes.",
      action: () => navigate("/contributors"),
      actionText: "Ajouter mes revenus",
      skipText: "Étape suivante",
    },
    {
      title: "Personnalisez vos catégories",
      icon: <Settings2 className="h-12 w-12 text-amber-500" />,
      description: "Créez des catégories personnalisées pour mieux organiser vos dépenses et obtenir des analyses détaillées de votre budget.",
      action: () => navigate("/user-settings?tab=expense-categories"),
      actionText: "Configurer les catégories",
      skipText: "Étape suivante",
    },
    {
      title: "Ajoutez vos enseignes préférées",
      icon: <Store className="h-12 w-12 text-violet-500" />,
      description: "Configurez les enseignes où vous effectuez régulièrement des achats pour un suivi plus précis de vos habitudes de consommation.",
      action: () => navigate("/user-settings?tab=retailers"),
      actionText: "Gérer les enseignes",
      skipText: "Terminer",
    },
  ];

  const totalSteps = steps.length;
  const currentStep = steps[step];

  // Passer à l'étape suivante
  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Sauvegarder la préférence "ne plus afficher" et fermer
  const handleClose = async () => {
    if (dontShowAgain) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Mettre à jour le profil avec la préférence de ne plus voir l'onboarding
          const { error } = await supabase
            .from("profiles")
            .update({ onboarding_completed: true })
            .eq("id", user.id);
          
          if (error) throw error;
          toast.success("Vos préférences ont été enregistrées");
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des préférences:", error);
        toast.error("Une erreur est survenue lors de la sauvegarde de vos préférences");
      }
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full max-h-[85vh] overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <DialogHeader className="text-center w-full">
              <div className="mx-auto mb-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-full">
                {currentStep.icon}
              </div>
              <DialogTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                {currentStep.title}
              </DialogTitle>
              <div className="text-base text-indigo-600/80 dark:text-indigo-400 mt-2 max-w-sm mx-auto">
                {currentStep.description}
              </div>
            </DialogHeader>

            <div className="flex justify-center my-8 w-full">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 ${
                    index === step
                      ? "w-8 bg-indigo-500"
                      : index < step
                      ? "w-8 bg-indigo-300"
                      : "w-8 bg-gray-200 dark:bg-gray-700"
                  } mx-1 rounded-full transition-all duration-300`}
                />
              ))}
            </div>

            <div className="flex flex-col w-full gap-4 mt-2">
              {/* Afficher le bouton d'action seulement pour les étapes qui en ont un */}
              {step > 0 && currentStep.action && (
                <Button
                  onClick={currentStep.action}
                  className="w-full md:w-3/4 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 py-6"
                  size="lg"
                >
                  {currentStep.actionText}
                </Button>
              )}
              
              <div className="flex w-full justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                  className={`${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Précédent
                </Button>
                
                <Button
                  variant={step === 0 ? "default" : "ghost"}
                  onClick={nextStep}
                  className={step === 0 ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" : ""}
                >
                  {currentStep.skipText}
                  {step < totalSteps - 1 && step === 0 && <ChevronRight className="ml-1 h-4 w-4" />}
                </Button>
              </div>
              
              {step === totalSteps - 1 && (
                <div className="flex items-center space-x-2 mt-4 self-start">
                  <Checkbox 
                    id="dontShowAgain" 
                    checked={dontShowAgain} 
                    onCheckedChange={(checked) => setDontShowAgain(checked === true)}
                  />
                  <label
                    htmlFor="dontShowAgain"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Ne plus afficher ce guide
                  </label>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
