import { cn } from '@/lib/utils';
import { Step } from '../types';
import { useTheme } from 'next-themes';
import { CheckIcon } from 'lucide-react';

interface WizardStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
  colorScheme?: "green" | "purple" | "blue";
}

export const WizardStepper = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  className, 
  colorScheme = "green" 
}: WizardStepperProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Définition des couleurs en fonction du colorScheme
  const colors = {
    green: {
      bg: "bg-quaternary-600",
      bgHover: "hover:bg-quaternary-500",
      bgDark: "dark:bg-quaternary-700",
      bgDarkHover: "dark:hover:bg-quaternary-600",
      border: "border-quaternary-600",
      borderDark: "dark:border-quaternary-700",
      text: "text-quaternary-600",
      textDark: "dark:text-quaternary-400",
      completed: "bg-quaternary-600 dark:bg-quaternary-700",
      completedText: "text-white",
      inactive: "border-gray-300 dark:border-gray-600",
      inactiveText: "text-gray-400 dark:text-gray-500",
      line: "bg-quaternary-600 dark:bg-quaternary-700",
      linePending: "bg-gray-300 dark:bg-gray-600"
    },
    purple: {
      bg: "bg-purple-600",
      bgHover: "hover:bg-purple-500",
      bgDark: "dark:bg-purple-700",
      bgDarkHover: "dark:hover:bg-purple-600",
      border: "border-purple-600",
      borderDark: "dark:border-purple-700",
      text: "text-purple-600",
      textDark: "dark:text-purple-400",
      completed: "bg-purple-600 dark:bg-purple-700",
      completedText: "text-white",
      inactive: "border-gray-300 dark:border-gray-600",
      inactiveText: "text-gray-400 dark:text-gray-500",
      line: "bg-purple-600 dark:bg-purple-700",
      linePending: "bg-gray-300 dark:bg-gray-600"
    },
    blue: {
      bg: "bg-blue-600",
      bgHover: "hover:bg-blue-500",
      bgDark: "dark:bg-blue-700",
      bgDarkHover: "dark:hover:bg-blue-600",
      border: "border-blue-600",
      borderDark: "dark:border-blue-700",
      text: "text-blue-600",
      textDark: "dark:text-blue-400",
      completed: "bg-blue-600 dark:bg-blue-700",
      completedText: "text-white",
      inactive: "border-gray-300 dark:border-gray-600",
      inactiveText: "text-gray-400 dark:text-gray-500",
      line: "bg-blue-600 dark:bg-blue-700",
      linePending: "bg-gray-300 dark:bg-gray-600"
    }
  };

  const currentColors = colors[colorScheme];

  return (
    <div className={cn("my-4", className)}>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center relative",
              onStepClick ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => onStepClick && onStepClick(index)}
          >
            {/* Cercle de l'étape */}
            <div 
              className={cn(
                "rounded-full h-8 w-8 flex items-center justify-center border-2 transition-all",
                // Étape complétée
                currentStep > index && cn(
                  currentColors.completed,
                  currentColors.completedText
                ),
                // Étape active
                currentStep === index && cn(
                  "border-2",
                  currentColors.border,
                  currentColors.borderDark,
                  currentColors.text,
                  currentColors.textDark,
                  "bg-white dark:bg-gray-800"
                ),
                // Étape inactive
                currentStep < index && cn(
                  currentColors.inactive,
                  currentColors.inactiveText
                ),
                // État hover pour les étapes cliquables
                onStepClick && "hover:shadow-sm"
              )}
            >
              {currentStep > index ? <CheckIcon className="h-4 w-4" /> : index + 1}
            </div>
            
            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className="flex-1 w-full mx-2 min-w-[40px] relative">
                <div 
                  className={cn(
                    "h-[2px] absolute left-0 right-0 top-1/2 transform -translate-y-1/2 transition-all",
                    currentColors.linePending
                  )}
                />
                <div 
                  className={cn(
                    "h-[2px] absolute left-0 top-1/2 transform -translate-y-1/2 transition-all",
                    currentColors.line
                  )}
                  style={{ 
                    width: currentStep > index ? '100%' : currentStep === index ? '50%' : '0%' 
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Labels des étapes */}
      <div className="flex justify-between mt-2 px-1">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "text-xs lg:text-sm text-center px-2 transition-colors",
              index === currentStep ? cn(currentColors.text, currentColors.textDark, "font-medium") : 
                currentStep > index ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
            )}
            style={{ 
              maxWidth: `${100 / steps.length}%`, 
              width: `${100 / steps.length}%` 
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};
