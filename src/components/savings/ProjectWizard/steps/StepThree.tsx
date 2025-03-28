import { Label } from "@/components/ui/label";
import { SavingsMode } from "@/types/savings-project";
import { Button } from "@/components/ui/button";
import { Calendar, PiggyBank } from "lucide-react";
import { StepComponentProps } from "../types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StepThree = ({ mode = "par_date", onModeChange, data }: StepComponentProps) => {
  // If onModeChange is not provided, we don't want the component to crash
  const handleModeChange = (newMode: SavingsMode) => {
    onModeChange?.(newMode);
  };

  // Animation pour les boutons
  const buttonVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.03, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium text-green-800 dark:text-green-300">
          Mode d'épargne
        </Label>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choisissez comment vous souhaitez planifier votre épargne.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option Date Cible */}
        <motion.div
          variants={buttonVariants}
          animate={mode === 'par_date' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full h-36 flex flex-col items-center justify-center gap-4 p-6 relative overflow-hidden group",
              "border-2 hover:border-green-400 dark:hover:border-green-600 transition-all",
              "focus:outline-none focus-visible:ring focus-visible:ring-green-300 dark:focus-visible:ring-green-600 focus-visible:ring-opacity-50",
              mode === 'par_date' ? [
                "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                "shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
              ] : [
                "border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
                "text-gray-700 dark:text-gray-300"
              ]
            )}
            onClick={() => handleModeChange('par_date')}
          >
            {/* Fond décoratif animé */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
              mode === 'par_date' ? "from-green-100/80 to-green-50/30 dark:from-green-800/20 dark:to-green-900/10 opacity-100" : "",
              "group-hover:opacity-50"
            )} />
            
            {/* Contenu du bouton */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "p-3 rounded-full mb-3",
                mode === 'par_date' 
                  ? "bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-300" 
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              )}>
                <Calendar className="h-8 w-8" />
              </div>
              <div className="font-medium text-lg">Date cible</div>
              <p className="text-xs mt-1 text-center max-w-[80%] opacity-80">
                Définir une date limite pour atteindre votre objectif
              </p>
            </div>
          </Button>
        </motion.div>

        {/* Option Montant Mensuel */}
        <motion.div
          variants={buttonVariants}
          animate={mode === 'par_mensualite' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full h-36 flex flex-col items-center justify-center gap-4 p-6 relative overflow-hidden group",
              "border-2 hover:border-green-400 dark:hover:border-green-600 transition-all",
              "focus:outline-none focus-visible:ring focus-visible:ring-green-300 dark:focus-visible:ring-green-600 focus-visible:ring-opacity-50",
              mode === 'par_mensualite' ? [
                "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                "shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
              ] : [
                "border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
                "text-gray-700 dark:text-gray-300"
              ]
            )}
            onClick={() => handleModeChange('par_mensualite')}
          >
            {/* Fond décoratif animé */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
              mode === 'par_mensualite' ? "from-green-100/80 to-green-50/30 dark:from-green-800/20 dark:to-green-900/10 opacity-100" : "",
              "group-hover:opacity-50"
            )} />
            
            {/* Contenu du bouton */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "p-3 rounded-full mb-3",
                mode === 'par_mensualite' 
                  ? "bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-300" 
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              )}>
                <PiggyBank className="h-8 w-8" />
              </div>
              <div className="font-medium text-lg">Montant mensuel</div>
              <p className="text-xs mt-1 text-center max-w-[80%] opacity-80">
                Définir une somme mensuelle fixe à épargner
              </p>
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
