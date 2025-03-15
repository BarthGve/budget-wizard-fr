
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface WizardStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export const WizardStepper = ({ 
  steps, 
  currentStep, 
  onStepClick,
  className 
}: WizardStepperProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isComplete = currentStep > index;
          const isClickable = isComplete && onStepClick;
          
          return (
            <div key={index} className="flex flex-col items-center relative">
              {/* Ligne de progression entre les étapes */}
              {index < steps.length - 1 && (
                <div className="absolute w-full h-[2px] top-4 left-1/2">
                  <div 
                    className={cn(
                      "h-full bg-gray-200 dark:bg-gray-700 absolute left-0 top-0 w-full",
                      isComplete && "bg-green-200 dark:bg-green-800"
                    )} 
                  />
                </div>
              )}
              
              {/* Cercle d'étape */}
              <motion.div 
                className={cn(
                  "z-10 w-8 h-8 rounded-full flex items-center justify-center border-2",
                  "transition-all duration-300 ease-in-out mb-2",
                  isActive 
                    ? "bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20 dark:border-green-500 dark:text-green-400" 
                    : isComplete 
                      ? "bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600" 
                      : "bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                )}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                onClick={() => isClickable && onStepClick(index)}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                {isComplete ? <CheckIcon className="w-4 h-4" /> : index + 1}
              </motion.div>
              
              {/* Titre de l'étape */}
              <span 
                className={cn(
                  "text-xs font-medium truncate max-w-[80px] text-center",
                  isActive 
                    ? "text-green-600 dark:text-green-400" 
                    : isComplete 
                      ? "text-gray-700 dark:text-gray-300" 
                      : "text-gray-500 dark:text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
