import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SavingsProject } from "@/types/savings-project";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreditCard, Euro, Landmark, ReceiptText } from "lucide-react";

interface StepFiveProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
}

export const StepFive = ({ data, onChange }: StepFiveProps) => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
          Versement mensuel automatique
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Optez pour un versement mensuel automatique pour atteindre votre objectif plus facilement.
        </p>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-800/40 text-green-600 dark:text-green-300 rounded-full">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <Label htmlFor="convert-monthly" className="font-medium cursor-pointer">
              Ajouter un versement mensuel
            </Label>
            <p className="text-xs text-green-700/70 dark:text-green-300/70 mt-1">
              Constitue automatiquement votre épargne chaque mois
            </p>
          </div>
        </div>
        
        <Switch
          id="convert-monthly"
          checked={data.added_to_recurring}
          onCheckedChange={(checked) =>
            onChange({ ...data, added_to_recurring: checked })
          }
          className="data-[state=checked]:bg-green-600 data-[state=checked]:dark:bg-green-500"
        />
      </div>

      <AnimatePresence>
        {data.added_to_recurring && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "p-5 rounded-lg border mt-4 space-y-4",
              "bg-gradient-to-br from-white to-green-50/50",
              "dark:from-gray-900 dark:to-green-900/20",
              "border-green-200/70 dark:border-green-800/30"
            )}>
              <div className="flex items-center justify-between border-b border-green-100 dark:border-green-800/30 pb-3 mb-1">
                <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                  <Landmark className="h-4 w-4 mr-1.5 opacity-80" />
                  Résumé du versement mensuel
                </h4>
                <div className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-800/60 text-green-700 dark:text-green-300 rounded-full">
                  Actif
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Nom du projet */}
                <div className="flex items-start">
                  <div className="w-8 flex items-center justify-center mt-0.5 text-green-600 dark:text-green-400">
                    <ReceiptText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-700/70 dark:text-green-300/70">
                      Nom du projet
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {data.nom_projet || "Non défini"}
                    </p>
                  </div>
                </div>
                
                {/* Montant mensuel */}
                <div className="flex items-start">
                  <div className="w-8 flex items-center justify-center mt-0.5 text-green-600 dark:text-green-400">
                    <Euro className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-700/70 dark:text-green-300/70">
                      Montant mensuel
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {data.montant_mensuel 
                        ? formatter.format(data.montant_mensuel) + ' / mois'
                        : "Non défini"}
                    </p>
                  </div>
                </div>
                
                {/* Description */}
                <div className="flex items-start">
                  <div className="w-8 flex items-center justify-center mt-0.5 text-green-600 dark:text-green-400">
                    <ReceiptText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-700/70 dark:text-green-300/70">
                      Description
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                      {data.description || "Aucune description"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
