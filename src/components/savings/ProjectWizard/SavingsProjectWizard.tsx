import { useEffect } from "react";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { WizardStepper } from "./components/WizardStepper";
import { Step } from "./types";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription, Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, PiggyBank, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProjectWizard } from "./hooks/useProjectWizard";
import { createProject, createMonthlySaving } from "./utils/projectUtils";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SavingsProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const SavingsProjectWizard = ({ onClose, onProjectCreated }: SavingsProjectWizardProps) => {
  const {
    currentStep,
    formData,
    savingsMode,
    isLoading,
    error,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleChange,
    handleModeChange,
    setFormData,
    setIsLoading,
    setError,
  } = useProjectWizard({ onClose, onProjectCreated });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  // Thème de couleurs
  const colors = {
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-400",
    darkGradientFrom: "dark:from-green-700",
    darkGradientTo: "dark:to-emerald-600",
    iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    headingText: "text-green-900 dark:text-green-200",
    descriptionText: "text-green-700/80 dark:text-green-300/80",
    buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
    lightBg: "from-white via-green-50/40 to-green-100/70",
    darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
    borderLight: "border-green-100/70",
    borderDark: "dark:border-green-800/20",
    ringFocus: "focus-visible:ring-green-500 dark:focus-visible:ring-green-400",
    separator: "via-green-200/60 dark:via-green-800/30"
  };

  const steps: Step[] = [
    {
      title: "Informations générales",
      component: StepOne,
    },
    {
      title: "Objectif financier",
      component: StepTwo,
    },
    {
      title: "Image du projet",
      component: StepThree,
    },
    {
      title: "Planification",
      component: StepFour,
    },
    {
      title: "Versement mensuel",
      component: StepFive,
    },
  ];

  const handleFinish = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProject = await createProject(formData, savingsMode);
      
      if (formData.added_to_recurring && newProject) {
        await createMonthlySaving(formData, newProject.profile_id, newProject.id);
      }

      // Invalider les queries après création réussie
      await queryClient.invalidateQueries({ queryKey: ["savings-projects"] });

      // Forcer un rafraîchissement immédiat
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["savings-projects"] });
        queryClient.refetchQueries({ queryKey: ["dashboard-data"] });
      }, 100);

      toast({
        title: "Projet créé avec succès",
        description: formData.added_to_recurring 
          ? "Votre projet et son versement mensuel ont été créés." 
          : "Votre projet a été créé.",
      });
      
      onProjectCreated();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du projet:", err);
      setError("Impossible de créer le projet");
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isSecondStep = currentStep === 1;

  // Animation variants pour les transitions
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "sm:max-w-[800px] w-full p-0 shadow-lg rounded-lg border",
          isTablet && "sm:max-w-[90%] w-[90%]",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
          className={cn(
            "relative flex flex-col pb-6 rounded-lg",
            "bg-gradient-to-br",
            colors.lightBg,
            colors.darkBg
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
            colors.gradientFrom,
            colors.gradientTo,
            colors.darkGradientFrom,
            colors.darkGradientTo
          )} />

          {/* Radial gradient pour texture */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          {/* Bouton de fermeture */}
          <DialogClose 
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-20",
              "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {/* En-tête avec titre et description */}
          <div className="relative z-10 p-6 pb-2">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
                <PiggyBank className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                Nouveau projet d'épargne
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <DialogDescription className={cn("text-base", colors.descriptionText)}>
                Définissez votre objectif financier et planifiez votre épargne en quelques étapes.
              </DialogDescription>
            </div>
          </div>
          
          {/* Ligne séparatrice */}
          <div className={cn(
            "h-px w-full my-4",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Étapes du wizard */}
          <div className="px-6 py-2">
            <WizardStepper 
              steps={steps.map((step) => step.title)}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              className="py-2"
            />
          </div>
          
          {/* Contenu principal - composants d'étape */}
          <div className="relative flex-1 px-6 pt-6 pb-2 z-10 min-h-[320px]">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 mb-10">
                <CurrentStepComponent 
                  data={formData}
                  onChange={handleChange}
                  mode={savingsMode}
                  onModeChange={handleModeChange}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Boutons de navigation */}
          <div className="relative z-10 flex justify-between px-6 mt-auto pt-4">
            <Button 
              variant="outline"
              onClick={currentStep === 0 ? onClose : handlePrevious}
              className={cn(
                "border-gray-200 text-gray-700 dark:text-gray-300 dark:border-gray-700",
                "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              {currentStep === 0 ? "Annuler" : "Précédent"}
            </Button>

            <Button
              onClick={isLastStep ? handleFinish : handleNext}
              disabled={isLoading || (isSecondStep && !formData.montant_total)}
              className={cn(
                "text-white px-6 py-2 rounded-lg relative overflow-hidden",
                colors.buttonBg,
                isLoading && "opacity-80 pointer-events-none"
              )}
            >
              <span className={cn(
                "flex items-center gap-2",
                isLoading && "opacity-0"
              )}>
                {isLastStep ? "Créer le projet" : "Suivant"}
                {isLastStep && <Leaf className="h-4 w-4" />}
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </Button>
          </div>
          
          {/* Élément décoratif */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <PiggyBank className="w-full h-full" />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
