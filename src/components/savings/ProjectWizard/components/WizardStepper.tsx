
import { cn } from '@/lib/utils';
import { Step } from '../types';

interface WizardStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string; // Ajout de la propriété className optionnelle
}

export const WizardStepper = ({ steps, currentStep, onStepClick, className }: WizardStepperProps) => {
  return (
    <div className={cn("mb-8 mt-8", className)}>
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="flex items-center"
            onClick={() => onStepClick && onStepClick(index)}
            style={{ cursor: onStepClick ? 'pointer' : 'default' }}
          >
            <div 
              className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${currentStep > index ? 'bg-primary text-white border-primary' : 
                  currentStep === index ? 'border-primary text-primary' : 
                  'border-gray-300 text-gray-300'}`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`h-[2px] w-24 mx-2 ${
                  currentStep > index ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className="text-sm text-center" style={{ width: '100px' }}>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};
